import { create } from 'zustand';
import type { ColorScheme } from '../theme';

interface UIState {
  themeMode: ColorScheme;
}

interface UIActions {
  setThemeMode: (mode: ColorScheme) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  themeMode: 'system',
  setThemeMode: (themeMode) => set({ themeMode }),
}));
