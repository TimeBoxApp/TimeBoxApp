import i18n from '../i18n';
import CryptoJS from 'crypto-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCurrentUser } from '../../pages/Login/services/auth';
import { clearUser, setUser } from '../user';
import { error } from '../alerts';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

function decrypt(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

const encryptedLocalStorage = {
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

export const userStore = create(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user: user }),

      clearUser: () => set({ user: null }),

      refreshUser: async () => {
        const userDetails = await getCurrentUser();

        if (userDetails) setUser(userDetails);
      },

      isLoggedIn: () => {
        const user = get().user;

        return user && !!user.id;
      }
    }),
    {
      name: 'user',
      storage: encryptedLocalStorage
    }
  )
);
