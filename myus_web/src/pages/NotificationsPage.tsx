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
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    return new Date(ts).toLocaleDateString('es-ES');
  };

  const columns = [
    {
      key: 'appName',
      label: 'Aplicación',
      render: (item: Notification) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/15 rounded-lg">
            <Bell size={16} className="text-primary" />
          </div>
          <span className="font-medium text-text-primary text-sm">{item.appName}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Notificación',
      render: (item: Notification) => (
        <div className="max-w-[280px]">
          <p className="font-medium text-text-primary text-sm truncate">{item.title}</p>
          <p className="text-xs text-text-muted truncate mt-0.5">{item.content}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Hora',
      render: (item: Notification) => (
        <span className="text-sm text-text-muted">{formatTime(item.timestamp)}</span>
      ),
    },
    {
      key: 'isRead',
      label: 'Estado',
      render: (item: Notification) => (
        <span className={`px-3 py-1.5 text-xs rounded-full font-semibold ${
          item.isRead
            ? 'bg-background text-text-muted border border-border'
            : 'bg-primary/15 text-primary border border-primary/20'
        }`}>
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
          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notificaciones</h1>
          <p className="text-sm text-text-muted mt-1">{notifications.length} acumuladas</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar notificaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {/* Data Table */}
      {isLoading.notifications ? (
        <div className="flex items-center justify-center py-16 bg-surface rounded-xl border border-border">
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.notifications ? (
        <Card>
          <EmptyState
            icon={<Bell size={48} />}
            title="Error al cargar"
            description={errors.notifications}
            action={
              <button onClick={fetchNotifications} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">
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
