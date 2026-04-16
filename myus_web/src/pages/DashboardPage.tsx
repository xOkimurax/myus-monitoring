import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Contact, Phone, MapPin, Activity, ArrowRight } from 'lucide-react';
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
  }, [user?.deviceId]);

  const quickActions = [
    { label: 'Notificaciones', icon: Bell,   path: '/notifications', color: 'primary',   count: stats.totalNotifications },
    { label: 'Contactos',       icon: Contact, path: '/contacts',      color: 'secondary', count: stats.totalContacts },
    { label: 'Llamadas',        icon: Phone,   path: '/calls',         color: 'warning',   count: stats.totalCalls },
    { label: 'Ubicación',       icon: MapPin,  path: '/locations',      color: 'primary',   count: stats.locationUpdates },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    primary:   { bg: 'rgba(94,106,210,0.12)',   text: '#7170ff' },
    secondary: { bg: 'rgba(16,185,129,0.12)',   text: '#10b981' },
    warning:   { bg: 'rgba(245,158,11,0.12)',   text: '#f59e0b' },
    error:     { bg: 'rgba(239,68,68,0.12)',    text: '#ef4444' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-medium"
            style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            Dispositivo:{' '}
            <span style={{ color: '#d0d6e0', fontWeight: 510 }}>
              {selectedDevice?.deviceName || 'No seleccionado'}
            </span>
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-md"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Activity size={13} style={{ color: '#10b981' }} />
          <span className="text-xs font-medium" style={{ color: '#62666d' }}>
            Monitoreo activo
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#10b981' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <StatCard
            key={action.path}
            title={action.label}
            value={action.count}
            icon={<action.icon size={16} />}
            color={action.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}
        >
          {quickActions.map((action, i) => {
            const c = colorMap[action.color];
            const isLast = i === quickActions.length - 1;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="flex flex-col items-center p-5 text-center transition-all duration-150 group"
                style={{
                  borderRight: !isLast ? '1px solid rgba(255,255,255,0.05)' : undefined,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                <div
                  className="p-3 rounded-md mb-3 transition-transform duration-150 group-hover:scale-105"
                  style={{ backgroundColor: c.bg }}
                >
                  <action.icon size={18} style={{ color: c.text }} />
                </div>
                <span
                  className="text-sm font-medium mb-0.5"
                  style={{ color: '#f7f8f8', letterSpacing: '-0.01em' }}
                >
                  {action.label}
                </span>
                <span className="text-xs" style={{ color: '#62666d' }}>
                  {action.count} registros
                </span>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={13} style={{ color: '#62666d' }} />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Actividad Reciente">
        <div className="space-y-1.5">
          {[
            { icon: Bell,   color: 'primary',   title: 'Nueva notificación',      desc: 'WhatsApp — Hace 5 minutos' },
            { icon: MapPin, color: 'primary',   title: 'Ubicación actualizada',   desc: 'Hace 10 minutos' },
            { icon: Phone,  color: 'secondary', title: 'Llamada registrada',      desc: 'Llamada entrante — Hace 30 min' },
          ].map((item, i) => {
            const c = colorMap[item.color];
            return (
              <div
                key={i}
                className="flex items-center gap-3.5 p-3 rounded-md transition-colors duration-150 cursor-default"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  el.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = 'transparent';
                  el.style.borderColor = 'transparent';
                }}
              >
                <div className="p-2 rounded-md" style={{ backgroundColor: c.bg }}>
                  <item.icon size={14} style={{ color: c.text }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#f7f8f8' }}>
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#62666d' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
