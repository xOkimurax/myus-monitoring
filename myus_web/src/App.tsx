import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('insforge_code');
    const hasError = params.has('error');

    const finalizeAuth = async () => {
      try {
        // Check if SDK has a valid session (from OAuth callback or existing session)
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          // Update Zustand store with user data from SDK
          login({ ...data.user, accessToken: data.session?.accessToken });
        }
      } catch {
        // No valid session — that's fine, show login page
      }
      setAuthReady(true);
    };

    if (hasCode || hasError) {
      // OAuth callback in progress — give SDK time to exchange code for session
      const timer = setTimeout(finalizeAuth, 2500);
      return () => clearTimeout(timer);
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
