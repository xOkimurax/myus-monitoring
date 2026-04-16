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

function AppRoutes({ isAuthenticated }: { isAuthenticated: boolean }) {
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
  // Use a simple ref for auth state to avoid Zustand persist timing issues
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const { login } = useAuth();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('insforge_code');
    const error = params.get('error');

    console.log('[Auth V7] Effect running, hasCode:', !!code, 'hasError:', !!error);

    const doLogin = async () => {
      try {
        // Get session directly from SDK's token manager
        const authModule = insforge.auth as any;
        const tokenManager = authModule?.tokenManager;
        const session = tokenManager?.getSession?.();
        console.log('[Auth V7] getSession():', session);

        if (session?.user) {
          console.log('[Auth V7] Using tokenManager session');
          login({
            ...session.user,
            accessToken: session.accessToken,
          });
          setIsAuthenticated(true);
          return;
        }

        // Fallback to getCurrentUser
        console.log('[Auth V7] No tokenManager session, calling getCurrentUser...');
        const { data } = await insforge.auth.getCurrentUser();
        console.log('[Auth V7] getCurrentUser data:', JSON.stringify(data));

        if (data?.user) {
          console.log('[Auth V7] User found from getCurrentUser');
          login({
            ...data.user,
            accessToken: data.session?.accessToken || '',
          });
          setIsAuthenticated(true);
        } else {
          console.log('[Auth V7] No user found');
        }
      } catch (err) {
        console.error('[Auth V7] Error in doLogin:', err);
      }
    };

    if (code) {
      console.log('[Auth V7] OAuth code detected, waiting for SDK exchange...');
      // Wait for SDK to process the OAuth callback
      const timer = setTimeout(async () => {
        await doLogin();
        // Clean URL
        window.history.replaceState({}, '', `${window.location.pathname}`);
        setAuthReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (error) {
      console.log('[Auth V7] OAuth error:', error);
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
        <AppRoutes isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
