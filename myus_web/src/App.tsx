import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/common/Layout';
import { insforge } from './api/insforgeClient';
import {
  LoginPage,
  DashboardPage,
  NotificationsPage,
  ContactsPage,
  CallsPage,
  LocationsPage,
  FilesPage,
  SettingsPage,
} from './pages';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="calls" element={<CallsPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const [authReady, setAuthReady] = useState(false);
  const { login } = useAuth();
  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent double execution in React 18 strict mode
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('insforge_code');
    const hasError = params.has('error');

    const finalizeAuth = async () => {
      console.log('[Auth] Finalizing auth...');
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        console.log('[Auth] getCurrentUser result:', { user: data?.user, error });

        if (error || !data?.user) {
          console.log('[Auth] No user from getCurrentUser, clearing URL params');
          // Clear URL params only if auth failed
          const cleanParams = new URLSearchParams(window.location.search);
          cleanParams.delete('insforge_code');
          cleanParams.delete('error');
          window.history.replaceState({}, '', `${window.location.pathname}`);
          setAuthReady(true);
          return;
        }

        console.log('[Auth] User found, logging in:', data.user.email);
        // Update Zustand store
        login({
          ...data.user,
          accessToken: data.session?.accessToken || '',
        });

        // Clear URL params after successful auth
        window.history.replaceState({}, '', `${window.location.pathname}`);
      } catch (err) {
        console.error('[Auth] Error in finalizeAuth:', err);
      }
      setAuthReady(true);
    };

    if (hasCode) {
      console.log('[Auth] OAuth code detected, waiting for exchange...');
      // Wait for SDK to exchange code → save session
      // Some OAuth providers are slower, give it 4 seconds
      const timer = setTimeout(finalizeAuth, 4000);
      return () => clearTimeout(timer);
    } else if (hasError) {
      console.log('[Auth] OAuth error in URL, clearing and showing login');
      window.history.replaceState({}, '', `${window.location.pathname}`);
      setAuthReady(true);
    } else {
      // No callback, just check existing session
      finalizeAuth();
    }
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#08090a' }}>
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
