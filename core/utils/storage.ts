import browser from 'webextension-polyfill';

export class SecureStorage {
  static async setPassword(password: string): Promise<void> {
    const response = await browser.runtime.sendMessage({
      type: 'setPassword',
      password,
    });

    if (!response.success) {
      throw new Error(response.error);
    }
  }

  static async verifyPassword(password: string): Promise<boolean> {
    const response = await browser.runtime.sendMessage({
      type: 'verifyPassword',
      password,
    });

    if (response.success) {
      return response.result;
    } else {
      throw new Error(response.error);
    }
  }

  static async isPasswordSet(): Promise<boolean> {
    const response = await browser.runtime.sendMessage({
      type: 'isPasswordSet',
    });

    if (response.success) {
      return response.result;
    } else {
      throw new Error(response.error);
    }
  }

  static async set<T>(name: string, value: T, password: string): Promise<void> {
    const response = await browser.runtime.sendMessage({
      type: 'set',
      name,
      value,
      password,
    });

    if (!response.success) {
      throw new Error(response.error);
    }
  }

  static async get<T>(name: string, password: string): Promise<T | null> {
    const response = await browser.runtime.sendMessage({
      type: 'get',
      name,
      password,
    });

    if (response.success) {
      return response.result;
    } else {
      return null;
    }
  }
}
