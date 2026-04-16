import { useEffect, useState } from 'react';
import { Search, RefreshCw, Trash2, Bell } from 'lucide-react';
import { Card, DataTable, LoadingSpinner, EmptyState } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../api/endpoints';
import { Notification } from '../types';

export const NotificationsPage = () => {
  const { notifications, setNotifications, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');

  const fetchNotifications = async () => {
    if (!user?.deviceId) return;
    setLoading('notifications', true);
    try {
      const response = await notificationsApi.getAll(user.deviceId);
      setNotifications(response.data || []);
    } catch (err: any) {
      setError('notifications', err.message || 'Error');
    } finally {
      setLoading('notifications', false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.deviceId]);

  const filtered = notifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.appName.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000)    return 'Ahora';
    if (diff < 3600000)  return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    return new Date(ts).toLocaleDateString('es-ES');
  };

  const columns = [
    {
      key: 'appName',
      label: 'Aplicación',
      render: (item: Notification) => (
        <div className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-md"
            style={{ backgroundColor: 'rgba(94,106,210,0.1)' }}
          >
            <Bell size={14} style={{ color: '#7170ff' }} />
          </div>
          <span className="font-medium text-sm" style={{ color: '#f7f8f8' }}>
            {item.appName}
          </span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Notificación',
      render: (item: Notification) => (
        <div className="max-w-[280px]">
          <p className="font-medium text-sm truncate" style={{ color: '#f7f8f8' }}>
            {item.title}
          </p>
          <p
            className="text-xs truncate mt-0.5"
            style={{ color: '#62666d' }}
          >
            {item.content}
          </p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Hora',
      render: (item: Notification) => (
        <span className="text-sm" style={{ color: '#62666d' }}>
          {formatTime(item.timestamp)}
        </span>
      ),
    },
    {
      key: 'isRead',
      label: 'Estado',
      render: (item: Notification) => (
        <span
          className="px-3 py-1 text-xs rounded-full font-medium"
          style={
            item.isRead
              ? {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#62666d',
                }
              : {
                  backgroundColor: 'rgba(94,106,210,0.1)',
                  border: '1px solid rgba(94,106,210,0.25)',
                  color: '#7170ff',
                }
          }
        >
          {item.isRead ? 'Leído' : 'Nuevo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: Notification) => (
        <button
          onClick={() => setNotifications(notifications.filter((n) => n.id !== item.id))}
          className="p-2 rounded-md transition-all duration-150"
          style={{ color: '#62666d' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#ef4444';
            el.style.backgroundColor = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#62666d';
            el.style.backgroundColor = 'transparent';
          }}
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Notificaciones
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            {notifications.length} acumuladas
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150"
          style={{ backgroundColor: '#5e6ad2' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: '#62666d' }}
        />
        <input
          type="text"
          placeholder="Buscar notificaciones…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md py-2.5 pl-10 pr-4 text-sm transition-all duration-150"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f7f8f8',
            outline: 'none',
            letterSpacing: '-0.01em',
          }}
          onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(113,112,255,0.5)'; }}
          onBlur={(e) =>  { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      {/* Data Table */}
      {isLoading.notifications ? (
        <div
          className="flex items-center justify-center py-16 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.notifications ? (
        <Card>
          <EmptyState
            icon={<Bell size={40} />}
            title="Error al cargar"
            description={errors.notifications}
            action={
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: '#5e6ad2' }}
              >
                Reintentar
              </button>
            }
          />
        </Card>
      ) : (
        <Card className="p-0">
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(item) => item.id}
            emptyMessage="Sin notificaciones"
          />
        </Card>
      )}
    </div>
  );
};
