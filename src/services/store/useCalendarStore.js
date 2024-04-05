import { create } from 'zustand';

const useCalendarStore = create((set, get) => ({
  events: [],
  tasks: [],
  actions: {
    setEvents: (payload) => set(() => ({ events: payload })),
    setTasks: (payload) => set(() => ({ tasks: payload })),
    removeTask: (taskId) => set(() => ({ tasks: get().tasks.filter((task) => task.id === taskId) })),
    modifyEvent: (eventId, modifications) => {
      set((state) => {
        const eventIndex = state.events.findIndex((event) => event.id === eventId);
        if (eventIndex === -1) return;

        const updatedEvents = [...state.events];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          ...modifications
        };

        return { events: updatedEvents };
      });
    },
    addEvent: (payload) => set((state) => ({ events: [...state.events, payload] }))
  }
}));

export const useCalendarEvents = () => useCalendarStore((state) => state.events);
export const useCalendarTasks = () => useCalendarStore((state) => state.tasks);
export const useCalendarActions = () => useCalendarStore((state) => state.actions);
