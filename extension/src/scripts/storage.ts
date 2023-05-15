import CryptoJS from 'crypto-js';
import browser from 'webextension-polyfill';
import { CryptoStorage } from './webcrypto/storage';
import algosdk from 'algosdk';
import { STORAGE_TIMEOUT_SECONDS } from '../../../core/utils/storage';

let storage: CryptoStorage | null = null;
let storageExpiry: ReturnType<typeof setTimeout>;

export const StorageKeys = {
  passwordHash: 'passwordHash',
  primaryAddress: 'primaryAddress',
  addresses: 'addresses',
};

interface PasswordHash {
  hash: string;
  salt: string;
  iterations: number;
}

async function setLocalStorage<T>(name: string, value: T): Promise<void> {
  await browser.storage.local.set({ [name]: JSON.stringify(value) });
}

async function getLocalStorage<T>(name: string): Promise<T | null> {
  try {
    const storedValueJSON = await browser.storage.local.get(name);
    const storedValue: T = JSON.parse(storedValueJSON[name]);
    return storedValue || null;
  } catch (e) {
    return null;
  }
}

async function updateStorageTimeout() {
  if (storageExpiry) clearTimeout(storageExpiry);
  storageExpiry = setTimeout(() => {
    storage = null;
  }, 1000 * STORAGE_TIMEOUT_SECONDS);
}

async function set<T>(name: string, value: T): Promise<void> {
  if (storage) {
    updateStorageTimeout();
    const data = JSON.stringify(value);
    await storage.set(name, data);
  } else {
    throw Error('Storage not available.');
  }
}

async function remove(name: string): Promise<void> {
  if (storage) {
    updateStorageTimeout();
    await storage.delete(name);
  } else {
    throw Error('Storage not available.');
  }
}

async function get<T>(name: string): Promise<T | null> {
  if (storage) {
    updateStorageTimeout();
    const data = await storage.get(name);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } else {
    throw Error('Storage not available.');
  }
}

export async function isPasswordSet(): Promise<[boolean, boolean]> {
  try {
    const passwordHash = await getLocalStorage<PasswordHash>(
      StorageKeys.passwordHash
    );
    return [!!passwordHash, !!storage];
  } catch {
    return [false, false];
  }
}

function getPasswordHash(password: string): PasswordHash {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iterations = 1000;
  const keySize = 256 / 32;
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations,
  });
  const passwordHash: PasswordHash = {
    hash: hash.toString(),
    salt: salt.toString(),
    iterations: iterations,
  };
  return passwordHash;
}

export async function setPassword(data: { password: string }): Promise<void> {
  const passwordSet = await isPasswordSet();
  if (!passwordSet) {
    const passwordHash = getPasswordHash(data.password);
    await setLocalStorage(StorageKeys.passwordHash, passwordHash);
  }
}

export async function verifyPassword(data: {
  password: string;
}): Promise<boolean> {
  const passwordHash = await getLocalStorage<PasswordHash>(
    StorageKeys.passwordHash
  );
  if (!passwordHash) return false;
  const { salt, iterations, hash: storedHash } = passwordHash;
  const computedHash = CryptoJS.PBKDF2(
    data.password,
    CryptoJS.enc.Hex.parse(salt),
    {
      keySize: 256 / 32,
      iterations: iterations,
    }
  );
  if (computedHash.toString() === storedHash) {
    updateStorageTimeout();
    storage = new CryptoStorage(data.password);
    return true;
  }
  return false;
}

export async function getPrimaryAddress(): Promise<string | null> {
  return await get(StorageKeys.primaryAddress);
}

export async function getAddresses(): Promise<string[]> {
  return (await get(StorageKeys.addresses)) || [];
}

export async function addAccount(data: {
  mnemonic: string;
}): Promise<string[]> {
  const account = algosdk.mnemonicToSecretKey(data.mnemonic);
  await set(account.addr, data.mnemonic);
  const addresses: string[] = [
    ...((await get<string[]>(StorageKeys.addresses)) || []),
    account.addr,
  ];
  console.log(addresses);
  await set(StorageKeys.addresses, addresses);
  return addresses;
}

export async function removeAccount(data: {
  address: string;
}): Promise<string[]> {
  await remove(data.address);
  const accounts: string[] = (await get(StorageKeys.addresses)) || [];
  await set(
    StorageKeys.addresses,
    accounts.filter((a) => a !== data.address)
  );
  return accounts;
}

export async function refresh(): Promise<void> {
  updateStorageTimeout();
}

export async function lock(): Promise<void> {
  clearTimeout(storageExpiry);
  storage = null;
}
