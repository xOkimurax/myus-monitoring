import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Contact, Phone, MapPin, Activity } from 'lucide-react';
import { Card, StatCard } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { notificationsApi, contactsApi, callLogsApi, locationsApi } from '../api/endpoints';

export const DashboardPage = () => {
  const { selectedDevice, setNotifications, setContacts, setCallLogs, setLocations } = useMonitoringStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalNotifications: 0, totalContacts: 0, totalCalls: 0, locationUpdates: 0 });

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
  }, [user?.deviceId]);

  const quickActions = [
    { label: 'Notificaciones', icon: Bell, path: '/notifications', color: 'primary', count: stats.totalNotifications },
    { label: 'Contactos', icon: Contact, path: '/contacts', color: 'secondary', count: stats.totalContacts },
    { label: 'Llamadas', icon: Phone, path: '/calls', color: 'warning', count: stats.totalCalls },
    { label: 'Ubicación', icon: MapPin, path: '/locations', color: 'error', count: stats.locationUpdates },
  ];

  const colorMap: Record<string, string> = {
    primary: '#5B5FC7',
    secondary: '#48BB78',
    warning: '#ED8936',
    error: '#E53E3E',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Dashboard</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Dispositivo: {selectedDevice?.deviceName || 'No seleccionado'}</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-[#E2E8F0]">
          <Activity size={14} className="text-[#48BB78]" />
          <span className="text-xs text-[#9CA3AF]">Monitoreo activo</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action) => (
          <StatCard
            key={action.path}
            title={action.label}
            value={action.count}
            icon={<action.icon size={20} />}
            color={action.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Acciones Rápidas">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex flex-col items-center p-6 bg-[#F5F7FA] rounded-xl border border-[#E2E8F0] hover:border-[#5B5FC7] hover:shadow-md transition-all text-center"
            >
              <div
                className="p-3 rounded-lg mb-4"
                style={{ backgroundColor: `${colorMap[action.color]}15` }}
              >
                <action.icon size={22} style={{ color: colorMap[action.color] }} />
              </div>
              <span className="font-medium text-sm text-[#1A202C]">{action.label}</span>
              <span className="text-xs text-[#A0AEC0] mt-1">{action.count} registros</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Actividad Reciente">
        <div className="space-y-3">
          {[
            { icon: Bell, color: '#5B5FC7', title: 'Nueva notificación', desc: 'WhatsApp - Hace 5 minutos' },
            { icon: MapPin, color: '#48BB78', title: 'Ubicación actualizada', desc: 'Hace 10 minutos' },
            { icon: Phone, color: '#ED8936', title: 'Llamada registrada', desc: 'Llamada entrante - Hace 30 min' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-[#F5F7FA] rounded-lg">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A202C]">{item.title}</p>
                <p className="text-xs text-[#A0AEC0] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};