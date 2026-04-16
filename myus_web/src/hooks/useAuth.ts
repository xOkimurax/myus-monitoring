import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { insforge } from '../api/insforgeClient';
import { User } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, login: storeLogin, logout, setLoading, setError, error, isLoading, clearError } = useAuthStore();

  // Direct login - sets isAuthenticated without OAuth redirect (for OAuth callbacks from App.tsx)
  const loginWithUser = useCallback((userData: User) => {
    console.log('[useAuth] loginWithUser called, email:', userData.email);
    localStorage.setItem('auth_token', userData.accessToken);
    // Also persist full session so Zustand persist rehydrate works on refresh
    localStorage.setItem('myus-auth', JSON.stringify({
      user: userData,
      isAuthenticated: true,
    }));
    storeLogin(userData);
  }, [storeLogin]);

  const handleGoogleLogin = useCallback(async () => {
    clearError();
    setLoading(true);

    try {
      const { data, error: oauthError } = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin + '/dashboard',
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
        return { success: false, error: oauthError.message };
      }

      // OAuth redirects, so we don't need to do anything here
      // The page will redirect to Google, and after auth, to the redirect URL
      if (data?.url) {
        window.location.href = data.url;
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar con Google';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [clearError, setError, setLoading]);

  const checkAuth = useCallback(async () => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User;
        // Check if session is still valid
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          storeLogin(userData);
          return true;
        }
        // Session expired, clear storage
        localStorage.removeItem('user');
        return false;
      } catch {
        localStorage.removeItem('user');
        return false;
      }
    }
    return false;
  }, [storeLogin]);

  const handleLogout = useCallback(async () => {
    try {
      await insforge.auth.signOut();
    } catch {
      // Ignore logout errors
    } finally {
      logout();
      localStorage.removeItem('user');
    }
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleGoogleLogin,
    loginWithUser,  // Use this from App.tsx OAuth callback
    register: handleGoogleLogin,
    logout: handleLogout,
    clearError,
    checkAuth,
  };
};
