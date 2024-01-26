import create from 'zustand';
import { persist } from 'zustand/middleware';

import { encryptedLocalStorage } from './helpers/encryptedLocalStorage';

export const usePomodoroStore = create(
  persist(
    (set, get) => ({
      timer: 25 * 60,
      isPaused: true,
      mode: 'work',
      pomodoroCount: 0,
      startTimer: () => set({ isPaused: false }),
      pauseTimer: () => set({ isPaused: true }),
      resetTimer: () => {
        const newMode = get().mode === 'work' ? 'rest' : 'work';
        const newCount = newMode === 'work' ? get().pomodoroCount + 1 : get().pomodoroCount;

        set({
          isPaused: true,
          pomodoroCount: newCount,
          timer: newMode === 'rest' ? (newCount % 4 === 0 ? 15 * 60 : 5 * 60) : 25 * 60,
          mode: newMode
        });
      },
      switchMode: () =>
        set((state) => {
          const isLongBreak = state.pomodoroCount % 4 === 0 && state.mode === 'rest';

          return {
            mode: state.mode === 'work' ? 'rest' : 'work',
            timer: state.mode === 'work' ? (isLongBreak ? 15 * 60 : 5 * 60) : 25 * 60,
            pomodoroCount: isLongBreak ? 0 : state.pomodoroCount
          };
        })
    }),
    {
      name: 'pomodoro',
      storage: encryptedLocalStorage
    }
  )
);
