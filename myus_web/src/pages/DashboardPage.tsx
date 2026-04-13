import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Contact,
  Phone,
  MapPin,
  Folder,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Card, StatCard } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { notificationsApi, contactsApi, callLogsApi, locationsApi } from '../api/endpoints';

export const DashboardPage = () => {
  const { selectedDevice, setNotifications, setContacts, setCallLogs, setLocations } = useMonitoringStore();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Dashboard</h1>
          <p className="text-[#6B7280] mt-1">
            Dispositivo: {selectedDevice?.deviceName || 'No seleccionado'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280] bg-white px-4 py-2 rounded-xl border border-gray-200">
          <Activity size={16} className="text-[#10B981]" />
          <span>Monitoreo activo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex flex-col items-center p-6 bg-[#FAFBFC] rounded-xl border border-gray-200 hover:border-[#5B5FC7] hover:shadow-lg transition-all text-center"
            >
              <div className={`p-3 rounded-xl mb-4`} style={{ backgroundColor: `${action.color === 'primary' ? '#5B5FC7' : action.color === 'secondary' ? '#7DD3C0' : action.color === 'warning' ? '#F59E0B' : '#EF4444'}15` }}>
                <action.icon size={24} style={{ color: action.color === 'primary' ? '#5B5FC7' : action.color === 'secondary' ? '#7DD3C0' : action.color === 'warning' ? '#F59E0B' : '#EF4444' }} />
              </div>
              <span className="font-semibold text-[#1F2937]">{action.label}</span>
              <span className="text-sm text-[#9CA3AF] mt-1">{action.count} registros</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Actividad Reciente" icon={<Clock size={20} />}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] rounded-xl">
              <div className="p-3 bg-[#5B5FC7]/10 rounded-xl">
                <Bell size={18} className="text-[#5B5FC7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">Nueva notificación</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">WhatsApp - Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] rounded-xl">
              <div className="p-3 bg-[#7DD3C0]/10 rounded-xl">
                <MapPin size={18} className="text-[#7DD3C0]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">Ubicación actualizada</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Hace 10 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#FAFBFC] rounded-xl">
              <div className="p-3 bg-[#F59E0B]/10 rounded-xl">
                <Phone size={18} className="text-[#F59E0B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">Llamada registrada</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Llamada entrante - Hace 30 minutos</p>
              </div>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card title="Estado del Sistema" icon={<AlertCircle size={20} />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#FAFBFC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                <span className="text-sm text-[#1F2937]">API Insforge</span>
              </div>
              <span className="text-sm text-[#10B981] font-medium">Operativo</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#FAFBFC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                <span className="text-sm text-[#1F2937]">WebSocket</span>
              </div>
              <span className="text-sm text-[#10B981] font-medium">Conectado</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#FAFBFC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                <span className="text-sm text-[#1F2937]">Sincronización</span>
              </div>
              <span className="text-sm text-[#6B7280]">Hace 5 min</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#FAFBFC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#F59E0B] rounded-full" />
                <span className="text-sm text-[#1F2937]">Batería dispositivo</span>
              </div>
              <span className="text-sm text-[#F59E0B] font-medium">45%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};