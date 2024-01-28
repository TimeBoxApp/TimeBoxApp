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
      },
      updateUserPreferences: (preferences) => {
        const user = get().user;

        if (user) {
          const updatedUser = {
            ...user,
            preferences: {
              ...user.preferences,
              ...preferences
            }
          };

          set({ user: updatedUser });
        }
      },
      updateUserInfo: (info) => {
        const user = get().user;

        if (user) {
          const updatedUser = {
            ...user,
            ...info
          };

          setUser(updatedUser);
        }
      },
      userHasFeature: (featureName) => {
        const user = get().user;
        const featureKeysMapping = {
          pomodoro: 'isPomodoroEnabled',
          bookList: 'isBookListEnabled'
        };

        return user && user.preferences && !!user.preferences[featureKeysMapping[featureName]];
      }
    }),
    {
      name: 'user',
      storage: encryptedLocalStorage
    }
  )
);
