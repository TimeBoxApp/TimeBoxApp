import { create } from 'zustand';

const useCurrentWeekStore = create((set, get) => ({
  currentWeek: { id: null, name: '', startDate: '', endDate: '' },
  actions: {
    setCurrentWeek: (payload) => set((state) => ({ currentWeek: { ...state.currentWeek, ...payload } })),
    clearCurrentWeek: () => set(() => ({ currentWeek: { id: null, name: '', startDate: '', endDate: '' } }))
  }
}));

export const useCurrentWeek = () => useCurrentWeekStore((state) => state.currentWeek);
export const useCurrentWeekActions = () => useCurrentWeekStore((state) => state.actions);
