import browser from 'webextension-polyfill';
import {
  setPassword,
  verifyPassword,
  isPasswordSet,
  set,
  get,
} from './storage';

browser.runtime.onMessage.addListener(
  (message, sender, sendResponse: (data: any) => void) => {
    if (message.type === 'setPassword') {
      setPassword(message.password)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }

    if (message.type === 'verifyPassword') {
      verifyPassword(message.password)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }

    if (message.type === 'isPasswordSet') {
      isPasswordSet()
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }

    if (message.type === 'set') {
      set(message.name, message.value, message.password)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }

    if (message.type === 'get') {
      get(message.name, message.password)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }

    return true;
  }
);
