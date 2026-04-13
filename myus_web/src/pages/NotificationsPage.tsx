import { useEffect, useState } from 'react';
import { Search, Filter, RefreshCw, Trash2, Bell, Check } from 'lucide-react';
import { Card, DataTable, LoadingSpinner, EmptyState } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../api/endpoints';
import { Notification } from '../types';

export const NotificationsPage = () => {
  const { notifications, setNotifications, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [appFilter, setAppFilter] = useState<string>('all');

  const fetchNotifications = async () => {
    if (!user?.deviceId) return;
    setLoading('notifications', true);
    try {
      const response = await notificationsApi.getAll(user.deviceId);
      setNotifications(response.data || []);
    } catch (err: any) {
      setError('notifications', err.message || 'Error al cargar notificaciones');
    } finally {
      setLoading('notifications', false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.deviceId]);

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleClearAll = async () => {
    if (!user?.deviceId) return;
    try {
      await notificationsApi.clearAll(user.deviceId);
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    return date.toLocaleDateString('es-ES');
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.appName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApp = appFilter === 'all' || n.appPackage === appFilter;
    return matchesSearch && matchesApp;
  });

  const uniqueApps = [...new Set(notifications.map((n) => n.appName))];

  const columns = [
    {
      key: 'appName',
      label: 'Aplicación',
      render: (item: Notification) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell size={16} className="text-primary" />
          </div>
          <span className="font-medium">{item.appName}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Título',
      render: (item: Notification) => (
        <div>
          <p className="font-medium truncate max-w-xs">{item.title}</p>
          <p className="text-sm text-gray-400 truncate max-w-xs">{item.content}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Hora',
      render: (item: Notification) => (
        <span className="text-sm text-gray-400">{formatTimestamp(item.timestamp)}</span>
      ),
    },
    {
      key: 'isRead',
      label: 'Estado',
      render: (item: Notification) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.isRead ? 'bg-gray-700 text-gray-400' : 'bg-primary/20 text-primary'
          }`}
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
          onClick={() => handleDelete(item.id)}
          className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
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
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-gray-400 mt-1">{notifications.length} notificaciones acumuladas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error border border-error/20 rounded-lg hover:bg-error/20 transition-colors"
          >
            <Trash2 size={18} />
            Limpiar todo
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar notificaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={appFilter}
              onChange={(e) => setAppFilter(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-10 pr-8 text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">Todas las apps</option>
              {uniqueApps.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading.notifications ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.notifications ? (
          <EmptyState
            icon={<Bell size={48} />}
            title="Error al cargar"
            description={errors.notifications}
            action={
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reintentar
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay notificaciones"
          />
        )}
      </Card>
    </div>
  );
};