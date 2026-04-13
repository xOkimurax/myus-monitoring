export interface User {
  id: string;
  email: string;
  deviceId: string;
  accessToken: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  status: 'active' | 'inactive';
  lastSeenAt: number;
  registeredAt: number;
}

export interface Notification {
  id: string;
  deviceId: string;
  appName: string;
  appPackage: string;
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface Contact {
  id: string;
  deviceId: string;
  name: string;
  phoneNumbers: PhoneNumber[];
  emails: Email[];
  photoUri?: string;
  syncedAt: number;
}

export interface PhoneNumber {
  type: string;
  number: string;
}

export interface Email {
  type: string;
  email: string;
}

export interface CallLog {
  id: string;
  deviceId: string;
  contactName: string;
  phoneNumber: string;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED';
  duration: number;
  timestamp: number;
}

export interface Location {
  id: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
}

export interface FileEvent {
  id: string;
  deviceId: string;
  filePath: string;
  fileName: string;
  operation: 'CREATE' | 'DELETE' | 'MODIFY';
  fileSize?: number;
  mimeType?: string;
  timestamp: number;
}

export interface SyncPayload {
  deviceId: string;
  syncId: string;
  timestamp: number;
  data: {
    notifications: Notification[];
    contacts: Contact[];
    callLogs: CallLog[];
    fileEvents: FileEvent[];
    locations: Location[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}