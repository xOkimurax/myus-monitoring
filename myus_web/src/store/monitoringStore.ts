import { create } from 'zustand';
import { Device, Notification, Contact, CallLog, Location, FileEvent } from '../types';

type PageSection = 'notifications' | 'contacts' | 'callLogs' | 'locations' | 'files';
type LoadingSection = 'devices' | 'notifications' | 'contacts' | 'callLogs' | 'locations' | 'files';
type ErrorSection = 'devices' | 'notifications' | 'contacts' | 'callLogs' | 'locations' | 'files';

interface MonitoringState {
  devices: Device[];
  selectedDevice: Device | null;
  notifications: Notification[];
  contacts: Contact[];
  callLogs: CallLog[];
  locations: Location[];
  fileEvents: FileEvent[];

  // Pagination
  currentPage: Record<PageSection, number>;

  // Loading states
  isLoading: Record<LoadingSection, boolean>;

  // Error states
  errors: Record<ErrorSection, string | null>;

  // Real-time
  lastSync: number | null;
  isConnected: boolean;

  // Actions
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setCallLogs: (callLogs: CallLog[]) => void;
  setLocations: (locations: Location[]) => void;
  setFileEvents: (fileEvents: FileEvent[]) => void;
  addNotification: (notification: Notification) => void;
  addLocation: (location: Location) => void;
  setPage: (section: PageSection, page: number) => void;
  setLoading: (section: LoadingSection, loading: boolean) => void;
  setError: (section: ErrorSection, error: string | null) => void;
  setConnected: (connected: boolean) => void;
  setLastSync: (timestamp: number) => void;
  clearAll: () => void;
}

const initialLoading: Record<LoadingSection, boolean> = {
  devices: false,
  notifications: false,
  contacts: false,
  callLogs: false,
  locations: false,
  files: false,
};

const initialErrors: Record<ErrorSection, string | null> = {
  devices: null,
  notifications: null,
  contacts: null,
  callLogs: null,
  locations: null,
  files: null,
};

export const useMonitoringStore = create<MonitoringState>((set) => ({
  devices: [],
  selectedDevice: null,
  notifications: [],
  contacts: [],
  callLogs: [],
  locations: [],
  fileEvents: [],

  currentPage: {
    notifications: 1,
    contacts: 1,
    callLogs: 1,
    locations: 1,
    files: 1,
  },

  isLoading: initialLoading,
  errors: initialErrors,
  lastSync: null,
  isConnected: false,

  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),

  setNotifications: (notifications) => set({ notifications }),
  setContacts: (contacts) => set({ contacts }),
  setCallLogs: (callLogs) => set({ callLogs }),
  setLocations: (locations) => set({ locations }),
  setFileEvents: (fileEvents) => set({ fileEvents }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),

  setPage: (section, page) =>
    set((state) => ({
      currentPage: { ...state.currentPage, [section]: page },
    })),

  setLoading: (section, loading) =>
    set((state) => ({
      isLoading: { ...state.isLoading, [section]: loading },
    })),

  setError: (section, error) =>
    set((state) => ({
      errors: { ...state.errors, [section]: error },
    })),

  setConnected: (connected) => set({ isConnected: connected }),
  setLastSync: (timestamp) => set({ lastSync: timestamp }),

  clearAll: () =>
    set({
      devices: [],
      selectedDevice: null,
      notifications: [],
      contacts: [],
      callLogs: [],
      locations: [],
      fileEvents: [],
      currentPage: {
        notifications: 1,
        contacts: 1,
        callLogs: 1,
        locations: 1,
        files: 1,
      },
      isLoading: initialLoading,
      errors: initialErrors,
      lastSync: null,
    }),
}));