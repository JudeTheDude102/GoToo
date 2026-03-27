import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';
import { createZustandMMKVStorage } from '../utils/mmkvStorage';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
}

interface AuthActions {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsOnboarded: (value: boolean) => void;
  clear: () => void;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isOnboarded: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
      clear: () => set(initialState),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => createZustandMMKVStorage('auth')),
      // isLoading is transient — never persist it
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isOnboarded: state.isOnboarded,
      }),
    },
  ),
);
