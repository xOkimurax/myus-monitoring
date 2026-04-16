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
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('insforge_code');
    const error = params.get('error');

    console.log('[Auth V5] Effect running, hasCode:', !!code, 'hasError:', !!error);

    const doLogin = async () => {
      try {
        // Get session directly from SDK's token manager (set by SDK during OAuth exchange)
        const session = (insforge.auth as any).tokenManager?.getSession?.();
        console.log('[Auth V5] Session from tokenManager:', session);

        if (session?.user) {
          console.log('[Auth V5] Logging in with session, email:', session.user.email);
          login({
            ...session.user,
            accessToken: session.accessToken,
          });
        } else {
          console.log('[Auth V5] No session in tokenManager, trying getCurrentUser');
          const { data } = await insforge.auth.getCurrentUser();
          console.log('[Auth V5] getCurrentUser result:', data);
          if (data?.user) {
            login({
              ...data.user,
              accessToken: data.session?.accessToken || '',
            });
          }
        }
      } catch (err) {
        console.error('[Auth V5] Error in doLogin:', err);
      }
    };

    if (code) {
      console.log('[Auth V5] OAuth code detected, waiting 3s for SDK exchange...');
      setTimeout(async () => {
        await doLogin();
        // Clean URL
        window.history.replaceState({}, '', `${window.location.pathname}`);
        setAuthReady(true);
      }, 3000);
    } else if (error) {
      console.log('[Auth V5] OAuth error:', error);
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
