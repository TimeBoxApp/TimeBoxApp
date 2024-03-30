import { create } from 'zustand';

const useCategoryStore = create((set, get) => ({
  categories: [],
  newCategory: {
    title: null,
    description: null,
    emoji: null,
    color: null
  },
  currentCategory: {
    title: null,
    description: null,
    emoji: null,
    color: null
  },
  actions: {
    setCategories: (payload) => set(() => ({ categories: payload })),
    addCategory: (payload) => set((state) => ({ categories: [...state.categories, payload] })),
    getCategory: (payload) => get().categories.find((category) => category.id === payload),
    updateCategory: (id, data) => {
      set((state) => ({
        categories: state.categories.map((category) => {
          if (category.id === id) {
            return { ...category, ...data };
          }

          return category;
        })
      }));
    },
    removeCategory: (payload) =>
      set((state) => ({ categories: [...state.categories.filter((category) => category.id !== payload)] })),
    updateNewCategory: (payload) => set((state) => ({ newCategory: { ...state.newCategory, ...payload } })),
    updateCurrentCategory: (payload) => set((state) => ({ currentCategory: { ...state.currentCategory, ...payload } })),
    clearNewCategory: () =>
      set({
        newCategory: {
          title: null,
          description: null,
          emoji: null,
          color: null
        }
      }),
    clearCurrentCategory: () =>
      set({
        currentCategory: {
          title: null,
          description: null,
          emoji: null,
          color: null
        }
      })
  }
}));

export const useCategories = () => useCategoryStore((state) => state.categories);
export const useNewCategory = () => useCategoryStore((state) => state.newCategory);
export const useCurrentCategory = () => useCategoryStore((state) => state.currentCategory);
export const useCategoryActions = () => useCategoryStore((state) => state.actions);
