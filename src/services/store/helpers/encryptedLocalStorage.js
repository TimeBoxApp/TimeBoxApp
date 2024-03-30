import CryptoJS from 'crypto-js';
import { error } from '../../alerts';
import i18n from '../../i18n';
import { clearUser } from '../../user';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

function decrypt(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

export const encryptedLocalStorage = {
  getItem: async (name) => {
    try {
      const item = localStorage.getItem(name);
      return item ? decrypt(item) : null;
    } catch (err) {
      console.error('Failed to get item from encrypted storage:', err);
      error(i18n.t('primary.errors.userDataRead'));
      localStorage.removeItem(name);
      clearUser();

      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const encryptedData = encrypt(value);
      localStorage.setItem(name, encryptedData);
    } catch (err) {
      console.error('Failed to set item in encrypted storage:', err);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (err) {
      console.error('Failed to remove item from encrypted storage:', err);
    }
  }
};
