import to from 'await-to-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCurrentUser } from '../../pages/Login/services/auth';
import { setUser } from '../user';
import { error } from '../alerts';
import { encryptedLocalStorage } from './helpers/encryptedLocalStorage';

export const userStore = create(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user: user }),

      clearUser: () => set({ user: null }),

      refreshUser: async () => {
        const [err, userDetails] = await to(getCurrentUser());

        if (err) return error();

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
