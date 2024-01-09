import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { getCurrentUser } from '../../pages/Login/services/auth';
import { setUser } from '../user';

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
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
