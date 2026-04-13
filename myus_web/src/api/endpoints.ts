import apiClient from './apiClient';
import { User, Device, Notification, Contact, CallLog, Location, FileEvent } from '../types';

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, deviceId: string) => {
    const response = await apiClient.post('/auth/register', { email, password, deviceId });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Device endpoints
export const deviceApi = {
  register: async (deviceId: string, deviceInfo: Partial<Device>) => {
    const response = await apiClient.post('/device/register', { device_id: deviceId, ...deviceInfo });
    return response.data;
  },

  getDevices: async (userId: string) => {
    const response = await apiClient.get(`/devices?userId=${userId}`);
    return response.data;
  },

  getDeviceInfo: async (deviceId: string) => {
    const response = await apiClient.get(`/device/${deviceId}`);
    return response.data;
  },

  updateDeviceStatus: async (deviceId: string, status: string) => {
    const response = await apiClient.put(`/device/${deviceId}/status`, { status });
    return response.data;
  },
};

// Notifications endpoints
export const notificationsApi = {
  getAll: async (deviceId: string, page = 1, limit = 50) => {
    const response = await apiClient.get('/notifications', {
      params: { deviceId, page, limit }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  sync: async (deviceId: string, notifications: Partial<Notification>[]) => {
    const response = await apiClient.post('/notifications/sync', {
      device_id: deviceId,
      notifications,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  clearAll: async (deviceId: string) => {
    const response = await apiClient.delete('/notifications', {
      params: { deviceId }
    });
    return response.data;
  },
};

// Contacts endpoints
export const contactsApi = {
  getAll: async (deviceId: string, page = 1, limit = 100) => {
    const response = await apiClient.get('/contacts', {
      params: { deviceId, page, limit }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  sync: async (deviceId: string, contacts: Partial<Contact>[]) => {
    const response = await apiClient.post('/contacts/sync', {
      device_id: deviceId,
      contacts,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },
};

// Call logs endpoints
export const callLogsApi = {
  getAll: async (deviceId: string, page = 1, limit = 100) => {
    const response = await apiClient.get('/call-logs', {
      params: { deviceId, page, limit }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/call-logs/${id}`);
    return response.data;
  },

  sync: async (deviceId: string, callLogs: Partial<CallLog>[]) => {
    const response = await apiClient.post('/call-logs/sync', {
      device_id: deviceId,
      call_logs: callLogs,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/call-logs/${id}`);
    return response.data;
  },
};

// Locations endpoints
export const locationsApi = {
  getAll: async (deviceId: string, page = 1, limit = 100) => {
    const response = await apiClient.get('/locations', {
      params: { deviceId, page, limit }
    });
    return response.data;
  },

  getLatest: async (deviceId: string) => {
    const response = await apiClient.get(`/locations/latest?deviceId=${deviceId}`);
    return response.data;
  },

  getHistory: async (deviceId: string, from: number, to: number) => {
    const response = await apiClient.get('/locations/history', {
      params: { deviceId, from, to }
    });
    return response.data;
  },

  sync: async (deviceId: string, locations: Partial<Location>[]) => {
    const response = await apiClient.post('/locations/sync', {
      device_id: deviceId,
      locations,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/locations/${id}`);
    return response.data;
  },
};

// Files endpoints
export const filesApi = {
  getAll: async (deviceId: string, page = 1, limit = 100) => {
    const response = await apiClient.get('/files', {
      params: { deviceId, page, limit }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/files/${id}`);
    return response.data;
  },

  sync: async (deviceId: string, fileEvents: Partial<FileEvent>[]) => {
    const response = await apiClient.post('/files/sync', {
      device_id: deviceId,
      file_events: fileEvents,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/files/${id}`);
    return response.data;
  },
};

export default {
  auth: authApi,
  device: deviceApi,
  notifications: notificationsApi,
  contacts: contactsApi,
  callLogs: callLogsApi,
  locations: locationsApi,
  files: filesApi,
};