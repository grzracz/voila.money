import CryptoJS from 'crypto-js';
import browser from 'webextension-polyfill';

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

export async function isPasswordSet(): Promise<boolean> {
  try {
    const storedValueJSON = await browser.storage.local.get(
      StorageKeys.passwordHash
    );
    const storedPasswordHash = JSON.parse(
      storedValueJSON[StorageKeys.passwordHash]
    ) as PasswordHash;
    return !!storedPasswordHash;
  } catch {
    return false;
  }
}

export async function setPassword(password: string): Promise<void> {
  const passwordSet = await isPasswordSet();
  if (!passwordSet) {
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
    await browser.storage.local.set({
      passwordHash: JSON.stringify(passwordHash),
    });
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const storedValueJSON = await browser.storage.local.get(
    StorageKeys.passwordHash
  );
  const storedPasswordHash = JSON.parse(
    storedValueJSON[StorageKeys.passwordHash]
  ) as PasswordHash;
  if (!storedPasswordHash) return false;
  const { salt, iterations, hash: storedHash } = storedPasswordHash;
  const computedHash = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: iterations,
  });
  return computedHash.toString() === storedHash;
}

export async function set<T>(
  name: string,
  value: T,
  password: string
): Promise<void> {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
    iv: iv,
  });
  const storedValue = {
    salt: salt.toString(),
    iv: iv.toString(),
    data: encrypted.toString(),
  };
  await browser.storage.local.set({ [name]: JSON.stringify(storedValue) });
}

export async function get<T>(
  name: string,
  password: string
): Promise<T | null> {
  const storedValueJSON = await browser.storage.local.get(name);
  const storedValue = JSON.parse(storedValueJSON[name]);
  if (!storedValue) return null;
  const { salt, iv, data } = storedValue;
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)) as T;
}
