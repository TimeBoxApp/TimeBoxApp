import to from 'await-to-js';
import { create } from 'zustand';

import { getCurrentUser } from '../../pages/Login/services/auth';
import { useCategoryStore } from './useCategoryStore';
import { error } from '../alerts';
import { encryptedLocalStorage } from './helpers/encryptedLocalStorage';

const localStorageKey = 'currentUserStore';

const loadState = async () => {
  try {
    const serializedState = await encryptedLocalStorage.getItem(localStorageKey);

    return serializedState ? serializedState : null;
  } catch (err) {
    return null;
  }
};

export const useCurrentUserStore = create((set, get) => ({
  user: {},
  preferences: { isPomodoroEnabled: false, isCalendarConnected: false },
  columnNames: {
    toDoColumnName: null,
    inProgressColumnName: null,
    doneColumnName: null
  },
  actions: {
    initStore: async () => {
      const loadedState = await loadState();

      if (loadedState) {
        set({
          user: loadedState.user || {},
          preferences: loadedState.preferences || {}
        });
      }
    },
    updateCurrentUser: async (userData) => {
      let userDetails = userData;

      if (!userData) {
        const [err, response] = await to(getCurrentUser());

        userDetails = response;

        if (err) return error();
      }

      if (userDetails) {
        const { id = null, email = null, firstName = null, lastName = null, dateFormat = null } = userDetails;
        const user = {
          id,
          email,
          firstName,
          lastName,
          fullName: firstName || lastName ? `${firstName || ''} ${lastName || ''}` : '',
          initials: firstName || lastName ? `${firstName[0] || ''}${lastName[0] || ''}` : '',
          dateFormat: dateFormat || 'DD.MM.YYYY'
        };
        set({ user });

        if (userDetails?.categories) {
          const { setCategories } = useCategoryStore.getState().actions;

          setCategories(userDetails?.categories);
        }

        const { isPomodoroEnabled = false, isCalendarConnected = false } = userDetails?.preferences;
        const preferences = {
          isPomodoroEnabled,
          isCalendarConnected
        };

        set({ preferences });

        const { toDoColumnName = null, inProgressColumnName = null, doneColumnName = null } = userDetails?.preferences;
        const columnNames = {
          toDoColumnName,
          inProgressColumnName,
          doneColumnName
        };

        set({ columnNames });

        encryptedLocalStorage.setItem(localStorageKey, {
          user: get().user,
          preferences: get().preferences
        });
      }
    },
    updateUserInfo: (payload) => {
      set((state) => {
        const newFirstName = payload.firstName ? payload.firstName : state.user.firstName;
        const newLastName = payload.lastName ? payload.lastName : state.user.lastName;
        const fullName = `${newFirstName || ''} ${newLastName || ''}`.trim();
        const initials = `${newFirstName ? [0] : ''}${newLastName ? [0] : ''}`.toUpperCase();
        return {
          user: {
            ...state.user,
            ...payload,
            ...(payload.firstName || payload.lastName ? { fullName, initials } : {})
          }
        };
      });

      encryptedLocalStorage.setItem(localStorageKey, {
        user: get().user
      });
    },
    updateUserPreferences: (payload) => {
      set((state) => ({ preferences: { ...state.preferences, ...payload } }));

      encryptedLocalStorage.setItem(localStorageKey, {
        preferences: get().preferences
      });
    },
    updateColumnNames: (payload) => set((state) => ({ columnNames: { ...state.columnNames, ...payload } })),
    userHasFeature: (featureName) => {
      const featureKeysMapping = {
        pomodoro: 'isPomodoroEnabled'
      };

      const preferences = get().preferences;
      return !!preferences[featureKeysMapping[featureName]];
    },
    clearCurrentUser: () => {
      set({ user: {} });
      encryptedLocalStorage.removeItem(localStorageKey);
    }
  }
}));

export const useCurrentUser = () => useCurrentUserStore((state) => state.user);
export const useCurrentUserPreferences = () => useCurrentUserStore((state) => state.preferences);
export const useCurrentUserColumnMapping = () => useCurrentUserStore((state) => state.columnNames);
export const useCurrentUserActions = () => useCurrentUserStore((state) => state.actions);
