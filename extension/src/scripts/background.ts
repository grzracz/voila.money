import browser from 'webextension-polyfill';
import { SecureMessageTypes } from '../../../core/utils/storage';
import {
  setPassword,
  verifyPassword,
  isPasswordSet,
  addAccount,
  removeAccount,
  getAddresses,
  getPrimaryAddress,
  lock,
  refresh,
} from './storage';

const SecureMessageListenerFunctionMap: Record<
  (typeof SecureMessageTypes)[keyof typeof SecureMessageTypes],
  (data: any) => Promise<any>
> = {
  [SecureMessageTypes.isPasswordSet]: isPasswordSet,
  [SecureMessageTypes.verifyPassword]: verifyPassword,
  [SecureMessageTypes.setPassword]: setPassword,
  [SecureMessageTypes.getPrimaryAddress]: getPrimaryAddress,
  [SecureMessageTypes.getAddresses]: getAddresses,
  [SecureMessageTypes.addAccount]: addAccount,
  [SecureMessageTypes.removeAccount]: removeAccount,
  [SecureMessageTypes.lock]: lock,
  [SecureMessageTypes.refresh]: refresh,
};

browser.runtime.onMessage.addListener(
  (
    message: { type: keyof typeof SecureMessageTypes; data: any },
    _,
    sendResponse: (data: any) => void
  ) => {
    const fn = SecureMessageListenerFunctionMap[message.type];
    if (fn) {
      fn(message.data)
        .then((result: any) => sendResponse({ success: true, result }))
        .catch((error: any) => sendResponse({ success: false, error }));
      return true;
    }
  }
);
