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

  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary/15', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/15', text: 'text-secondary' },
    warning: { bg: 'bg-warning/15', text: 'text-warning' },
    error: { bg: 'bg-error/15', text: 'text-error' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Dispositivo: <span className="text-text-secondary font-medium">{selectedDevice?.deviceName || 'No seleccionado'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2.5 rounded-xl border border-border">
          <Activity size={14} className="text-secondary" />
          <span className="text-xs text-text-muted font-medium">Monitoreo activo</span>
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <Card title="Acciones Rápidas" className="p-0 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {quickActions.map((action) => {
            const c = colorMap[action.color];
            return (
              <Link
                key={action.path}
                to={action.path}
                className="flex flex-col items-center p-6 hover:bg-background/60 transition-all duration-200 text-center group"
              >
                <div className={`p-3.5 rounded-xl mb-4 ${c.bg} group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon size={20} className={c.text} />
                </div>
                <span className="font-semibold text-sm text-text-primary mb-1">{action.label}</span>
                <span className="text-xs text-text-muted">{action.count} registros</span>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-text-muted" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Actividad Reciente">
        <div className="space-y-3">
          {[
            { icon: Bell, color: 'primary', title: 'Nueva notificación', desc: 'WhatsApp - Hace 5 minutos' },
            { icon: MapPin, color: 'secondary', title: 'Ubicación actualizada', desc: 'Hace 10 minutos' },
            { icon: Phone, color: 'warning', title: 'Llamada registrada', desc: 'Llamada entrante - Hace 30 min' },
          ].map((item, i) => {
            const c = colorMap[item.color];
            return (
              <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-background/80 transition-colors">
                <div className={`p-2.5 rounded-lg ${c.bg}`}>
                  <item.icon size={15} className={c.text} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
