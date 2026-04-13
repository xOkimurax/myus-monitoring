import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { supabaseConfig } from '../api/apiClient';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { Notification, Location } from '../types';

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { addNotification, addLocation, setConnected, setLastSync } = useMonitoringStore();
  const { user } = useAuthStore();

  const connect = useCallback(() => {
    if (!user?.deviceId || socketRef.current?.connected) return;

    const socket = io(supabaseConfig.realtimeUrl, {
      auth: {
        deviceId: user.deviceId,
        token: user.accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);

      // Subscribe to device updates
      socket.emit('subscribe:device', { deviceId: user.deviceId });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('notification:new', (notification: Notification) => {
      addNotification(notification);
    });

    socket.on('location:update', (location: Location) => {
      addLocation(location);
      setLastSync(Date.now());
    });

    socket.on('device:online', ({ deviceId }) => {
      console.log('Device online:', deviceId);
    });

    socket.on('device:offline', ({ deviceId }) => {
      console.log('Device offline:', deviceId);
    });

    socket.on('sync:complete', ({ timestamp }) => {
      setLastSync(timestamp);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socketRef.current = socket;
  }, [user?.deviceId, user?.accessToken, addNotification, addLocation, setConnected, setLastSync]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('unsubscribe:device', { deviceId: user?.deviceId });
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }
  }, [user?.deviceId, setConnected]);

  const subscribeToDevice = useCallback((deviceId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe:device', { deviceId });
    }
  }, []);

  const unsubscribeFromDevice = useCallback((deviceId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe:device', { deviceId });
    }
  }, []);

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    connect,
    disconnect,
    subscribeToDevice,
    unsubscribeFromDevice,
    isConnected: socketRef.current?.connected || false,
  };
};