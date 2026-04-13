import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/endpoints';
import { User } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setLoading, setError, error, isLoading, clearError } = useAuthStore();
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = useCallback(async (email: string, password: string) => {
    clearError();
    setLoading(true);

    try {
      // Get or create device ID
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
      }

      const response = await authApi.login(email, password);

      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        deviceId: deviceId,
        accessToken: response.access_token,
      };

      login(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError, login, setError, setLoading]);

  const handleRegister = useCallback(async (email: string, password: string) => {
    clearError();
    setLoading(true);

    try {
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
      }

      const response = await authApi.register(email, password, deviceId);

      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        deviceId: deviceId,
        accessToken: response.access_token,
      };

      login(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearError, login, setError, setLoading]);

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      logout();
    }
  }, [logout]);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser) as User;
        login(userData);
        return true;
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        return false;
      }
    }
    return false;
  }, [login]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    rememberMe,
    setRememberMe,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
};