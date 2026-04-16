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

// Manual OAuth exchange after callback
async function exchangeCodeManually(code: string) {
  // Retrieve PKCE verifier from sessionStorage
  const verifier = sessionStorage.getItem('insforge_pkce_verifier');
  if (!verifier) {
    console.error('[Auth V3] PKCE verifier not found in sessionStorage');
    return null;
  }

  const baseUrl = 'https://jp84sgki.us-east.insforge.app';
  const apiKey = 'ik_62254b582d90713b376c887fba194fac';
  const response = await fetch(`${baseUrl}/api/auth/oauth/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
    credentials: 'include',
    body: JSON.stringify({ code, code_verifier: verifier }),
  });

  if (!response.ok) {
    console.error('[Auth V3] Code exchange failed:', response.status);
    return null;
  }

  const data = await response.json();
  console.log('[Auth] Code exchange response:', data);
  return data;
}

function App() {
  const [authReady, setAuthReady] = useState(false);
  const { login } = useAuth();
  const effectRan = useRef(false);

  useEffect(() => {
    console.log('[Auth V3] App mounted, effect running');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('insforge_code');
    const error = params.get('error');

    const finalizeAuth = async () => {
      console.log('[Auth V3] Finalizing auth...');
      try {
        const { data, error: userError } = await insforge.auth.getCurrentUser();
        console.log('[Auth V3] getCurrentUser:', { user: data?.user, error: userError });

        if (data?.user) {
          login({
            ...data.user,
            accessToken: data.session?.accessToken || '',
          });
          console.log('[Auth V3] Logged in via getCurrentUser');
        }
      } catch (err) {
        console.error('[Auth V3] Error:', err);
      }
      // Clean URL params
      window.history.replaceState({}, '', `${window.location.pathname}`);
      setAuthReady(true);
    };

    if (code) {
      console.log('[Auth V3] OAuth code detected, attempting manual exchange...');
      // Try manual exchange first (more reliable than SDK internal)
      exchangeCodeManually(code)
        .then((sessionData) => {
          if (sessionData?.user) {
            console.log('[Auth V3] Manual exchange success, logging in');
            login({
              ...sessionData.user,
              accessToken: sessionData.accessToken || '',
            });
            // Clear URL params
            window.history.replaceState({}, '', `${window.location.pathname}`);
            setAuthReady(true);
          } else {
            // Fall back to SDK's getCurrentUser after a delay
            console.log('[Auth V3] Manual exchange no data, waiting for SDK...');
            setTimeout(finalizeAuth, 3000);
          }
        })
        .catch((err) => {
          console.error('[Auth V3] Manual exchange error:', err);
          // Fall back to SDK
          setTimeout(finalizeAuth, 3000);
        });

      return;
    } else if (error) {
      console.log('[Auth] OAuth error:', error);
      window.history.replaceState({}, '', `${window.location.pathname}`);
      setAuthReady(true);
    } else {
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
