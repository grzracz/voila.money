import browser from 'webextension-polyfill';
import { ActionTypes, useStore } from './store';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import IconButton from '../components/IconButton';

export const SecureMessageTypes = {
  setPassword: 'setPassword',
  verifyPassword: 'verifyPassword',
  isPasswordSet: 'isPasswordSet',
  getPrimaryAddress: 'getPrimaryAddress',
  getAddresses: 'getAddresses',
  addAccount: 'addAccount',
  removeAccount: 'removeAccount',
  lock: 'lock',
  refresh: 'refresh',
};

// Storage gets removed from background script memory after this many seconds of inactivity using setTimeout
// Use "lock" to make it happen sooner
// Use "refresh" to set timer to 0
// Timer is set to 0 automatically after any get or set operation
// "setPassword" and "isPasswordSet" do not trigger refresh as they do not use CryptoStorage
export const STORAGE_TIMEOUT_WARNING_SECONDS = 4.5 * 60;
export const STORAGE_TIMEOUT_SECONDS = 5 * 60;

export class SecureStorage {
  private dispatch: (type: string, data?: any) => void;
  private warningToast: string | undefined;
  private warningTimeout: ReturnType<typeof setTimeout> | undefined;
  private storageTimeout: ReturnType<typeof setTimeout> | undefined;

  updateDispatch(_dispatch: (type: string, data?: any) => void) {
    this.dispatch = _dispatch;
  }

  constructor(_dispatch: (type: string, data?: any) => void) {
    this.dispatch = _dispatch;
    this.refreshStorageTimeout = this.refreshStorageTimeout.bind(this);
    this.setWarningTimeoutInner = this.setWarningTimeoutInner.bind(this);
    this.setWarningTimeout = this.setWarningTimeout.bind(this);
    this.setLockTimeoutInner = this.setLockTimeoutInner.bind(this);
    this.setLockTimeout = this.setLockTimeout.bind(this);
    this.lock = this.lock.bind(this);
  }

  private async handleMessage(type: string, data?: object) {
    const response = await browser.runtime.sendMessage({ type, data });
    if (response.success) {
      if (
        ![
          SecureMessageTypes.setPassword,
          SecureMessageTypes.isPasswordSet,
          SecureMessageTypes.lock,
          SecureMessageTypes.refresh,
        ].includes(type)
      )
        this.refreshStorageTimeout();
      return response.result;
    } else {
      throw new Error(response.error);
    }
  }

  private setWarningTimeoutInner() {
    this.warningToast = toast.loading(
      <div className="flex items-center space-x-3">
        <span>Your wallet will be locked soon</span>
        <IconButton
          small
          IconComponent={FaTimes}
          onClick={this.refreshStorageTimeout}
          name={'Cancel'}
        >
          <span>Cancel</span>
        </IconButton>
      </div>
    );
  }

  private setWarningTimeout() {
    return setTimeout(
      this.setWarningTimeoutInner,
      STORAGE_TIMEOUT_WARNING_SECONDS * 1000
    );
  }

  private async setLockTimeoutInner(toastId: string | undefined) {
    await this.lock();
    this.dispatch(ActionTypes.LOCK);
    toast.success('Your wallet has been locked', {
      id: toastId,
    });
  }

  private setLockTimeout() {
    return setTimeout(
      () => this.setLockTimeoutInner(this.warningToast),
      STORAGE_TIMEOUT_SECONDS * 1000
    );
  }

  private async refreshStorageTimeout() {
    await this.handleMessage(SecureMessageTypes.refresh);
    toast.remove(this.warningToast);
    clearTimeout(this.warningTimeout);
    clearTimeout(this.storageTimeout);
    this.warningTimeout = this.setWarningTimeout();
    this.storageTimeout = this.setLockTimeout();
  }

  async setPassword(password: string): Promise<void> {
    return await this.handleMessage(SecureMessageTypes.setPassword, {
      password,
    });
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await this.handleMessage(SecureMessageTypes.verifyPassword, {
      password,
    });
  }

  async isPasswordSet(): Promise<[boolean, boolean]> {
    return await this.handleMessage(SecureMessageTypes.isPasswordSet);
  }

  async getPrimaryAddress(): Promise<string[]> {
    return await this.handleMessage(SecureMessageTypes.getPrimaryAddress);
  }

  async getAddresses(): Promise<string[]> {
    return await this.handleMessage(SecureMessageTypes.getAddresses);
  }

  async addAccount(mnemonic: string): Promise<string[]> {
    return await this.handleMessage(SecureMessageTypes.addAccount, {
      mnemonic,
    });
  }

  async removeAccount(address: string): Promise<string[]> {
    return await this.handleMessage(SecureMessageTypes.removeAccount, {
      address,
    });
  }

  async lock(): Promise<void> {
    toast.dismiss(this.warningToast);
    clearTimeout(this.warningTimeout);
    clearTimeout(this.storageTimeout);
    return await this.handleMessage(SecureMessageTypes.lock);
  }
}

const SecureStorageContext = createContext<SecureStorage | undefined>(
  undefined
);

interface SecureStorageProviderProps {
  children: JSX.Element;
}

export const SecureStorageProvider: React.FC<SecureStorageProviderProps> = ({
  children,
}) => {
  const { dispatch } = useStore();
  const [storage, setStorage] = useState<SecureStorage | undefined>(
    new SecureStorage(dispatch)
  );

  useLayoutEffect(() => {
    setStorage(new SecureStorage(dispatch));
  }, [dispatch]);

  return (
    <SecureStorageContext.Provider value={storage}>
      {children}
    </SecureStorageContext.Provider>
  );
};

export const useSecureStorage = () => {
  const secureStorage = useContext(SecureStorageContext);
  if (!secureStorage) {
    throw new Error(
      'You must use useSecureStorage() within a <SecureStorageProvider />'
    );
  }
  return secureStorage;
};
