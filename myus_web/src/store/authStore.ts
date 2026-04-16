import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Read persisted session from localStorage on init
const getPersistedSession = () => {
  try {
    const stored = localStorage.getItem('myus-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        isAuthenticated: parsed.isAuthenticated || false,
      };
    }
  } catch {}
  return { user: null, isAuthenticated: false };
};

const persisted = getPersistedSession();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: persisted.user,
      isAuthenticated: persisted.isAuthenticated,
      isLoading: false,
      error: null,

      login: (user) => {
        console.log('[AuthStore] login() called, user:', user.email);
        // Store token in localStorage
        localStorage.setItem('auth_token', user.accessToken);
        // Update store state
        set({ user, isAuthenticated: true, error: null, isLoading: false });
        console.log('[AuthStore] after set(), isAuthenticated:', true);
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('myus-auth');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'myus-auth',
      // Only persist user and isAuthenticated
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
