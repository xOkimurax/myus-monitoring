import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Contact,
  Phone,
  MapPin,
  Folder,
  TrendingUp,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Card, StatCard } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { notificationsApi, contactsApi, callLogsApi, locationsApi } from '../api/endpoints';

export const DashboardPage = () => {
  const { selectedDevice, setNotifications, setContacts, setCallLogs, setLocations, setDevices } = useMonitoringStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalNotifications: 0,
    totalContacts: 0,
    totalCalls: 0,
    locationUpdates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.deviceId) return;

      try {
        // Fetch all data in parallel
        const [notifications, contacts, calls, locations] = await Promise.all([
          notificationsApi.getAll(user.deviceId).catch(() => ({ data: [] })),
          contactsApi.getAll(user.deviceId).catch(() => ({ data: [] })),
          callLogsApi.getAll(user.deviceId).catch(() => ({ data: [] })),
          locationsApi.getAll(user.deviceId).catch(() => ({ data: [] })),
        ]);

        setNotifications(notifications.data || []);
        setContacts(contacts.data || []);
        setCallLogs(calls.data || []);
        setLocations(locations.data || []);

        setStats({
          totalNotifications: (notifications.data || []).length,
          totalContacts: (contacts.data || []).length,
          totalCalls: (calls.data || []).length,
          locationUpdates: (locations.data || []).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user?.deviceId, setNotifications, setContacts, setCallLogs, setLocations]);

  const quickActions = [
    { label: 'Notificaciones', icon: Bell, path: '/notifications', color: 'primary', count: stats.totalNotifications },
    { label: 'Contactos', icon: Contact, path: '/contacts', color: 'secondary', count: stats.totalContacts },
    { label: 'Llamadas', icon: Phone, path: '/calls', color: 'warning', count: stats.totalCalls },
    { label: 'Ubicación', icon: MapPin, path: '/locations', color: 'error', count: stats.locationUpdates },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Dispositivo: {selectedDevice?.deviceName || 'No seleccionado'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity size={16} className="text-success" />
          <span>Monitoreo activo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Notificaciones"
          value={stats.totalNotifications}
          icon={<Bell size={24} />}
          color="primary"
        />
        <StatCard
          title="Contactos"
          value={stats.totalContacts}
          icon={<Contact size={24} />}
          color="secondary"
        />
        <StatCard
          title="Llamadas"
          value={stats.totalCalls}
          icon={<Phone size={24} />}
          color="warning"
        />
        <StatCard
          title="Ubicaciones"
          value={stats.locationUpdates}
          icon={<MapPin size={24} />}
          color="error"
        />
      </div>

      {/* Quick Actions */}
      <Card title="Acciones Rápidas" icon={<LayoutDashboard size={20} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex flex-col items-center p-4 bg-background rounded-lg border border-gray-700 hover:border-primary transition-colors"
            >
              <div className={`p-3 rounded-lg ${colorMap[action.color]}/10 mb-3`}>
                <action.icon size={24} className={`text-${action.color}`} />
              </div>
              <span className="font-medium">{action.label}</span>
              <span className="text-sm text-gray-400 mt-1">{action.count} registros</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Actividad Reciente" icon={<Clock size={20} />}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nueva notificación</p>
                <p className="text-xs text-gray-400">WhatsApp - Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <MapPin size={16} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ubicación actualizada</p>
                <p className="text-xs text-gray-400">Hace 10 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Phone size={16} className="text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Llamada registrada</p>
                <p className="text-xs text-gray-400">Llamada entrante - Hace 30 minutos</p>
              </div>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card title="Estado del Sistema" icon={<AlertCircle size={20} />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>API Insforge</span>
              </div>
              <span className="text-sm text-success">Operativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>WebSocket</span>
              </div>
              <span className="text-sm text-success">Conectado</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>Sincronización</span>
              </div>
              <span className="text-sm text-gray-400">Hace 5 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span>Batería dispositivo</span>
              </div>
              <span className="text-sm text-warning">45%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};