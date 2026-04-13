import axios from 'axios';

// Insforge DB Configuration
const INSFORGE_PROJECT_ID = '8d93d3ee-ba57-42e5-ace7-29518396a2d4';
const INSFORGE_API_URL = 'https://db.supabase.io';
const INSFORGE_REALTIME_URL = 'https://realtime.supabase.io';

export const apiClient = axios.create({
  baseURL: INSFORGE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'apikey': INSFORGE_PROJECT_ID,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const supabaseConfig = {
  projectId: INSFORGE_PROJECT_ID,
  apiUrl: INSFORGE_API_URL,
  realtimeUrl: INSFORGE_REALTIME_URL,
};

export default apiClient;