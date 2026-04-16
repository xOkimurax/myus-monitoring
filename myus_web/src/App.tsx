import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/common/Layout';
import { useAuthStore } from './store/authStore';
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
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('insforge_code');
    const error = params.get('error');

    console.log('[Auth V6] Effect running, hasCode:', !!code, 'hasError:', !!error);

    const doLogin = async () => {
      try {
        // First try: get session directly from SDK's token manager (fastest, sync)
        const authModule = insforge.auth as any;
        const tokenManager = authModule?.tokenManager;
        const session = tokenManager?.getSession?.();
        console.log('[Auth V6] getSession():', session);

        if (session?.user) {
          console.log('[Auth V6] Using tokenManager session, email:', session.user.email);
          login({
            ...session.user,
            accessToken: session.accessToken,
          });
          console.log('[Auth V6] login() called');
          return;
        }

        // Second try: getCurrentUser (async, may refresh token)
        console.log('[Auth V6] No tokenManager session, calling getCurrentUser...');
        const { data } = await insforge.auth.getCurrentUser();
        console.log('[Auth V6] getCurrentUser data:', JSON.stringify(data));

        if (data?.user) {
          console.log('[Auth V6] getCurrentUser user found');
          const userForLogin = {
            ...data.user,
            accessToken: data.session?.accessToken || '',
          };
          console.log('[Auth V6] Calling login() with:', userForLogin.email);
          login(userForLogin);
          console.log('[Auth V6] login() returned, store state:', useAuthStore.getState());
        } else {
          console.log('[Auth V6] No user in getCurrentUser either');
        }
      } catch (err) {
        console.error('[Auth V6] Error in doLogin:', err);
      }
    };

    if (code) {
      console.log('[Auth V6] OAuth code detected, waiting 3s for SDK exchange...');
      setTimeout(async () => {
        await doLogin();
        // Clean URL
        window.history.replaceState({}, '', `${window.location.pathname}`);
        setAuthReady(true);
      }, 3000);
    } else if (error) {
      console.log('[Auth V6] OAuth error:', error);
      window.history.replaceState({}, '', `${window.location.pathname}`);
      setAuthReady(true);
    } else {
      (async () => {
        await doLogin();
        setAuthReady(true);
      })();
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
