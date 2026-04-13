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

  useEffect(() => { fetchNotifications(); }, [user?.deviceId]);

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
          <div className="p-2.5 bg-[#5B5FC7]/10 rounded-xl">
            <Bell size={16} className="text-[#5B5FC7]" />
          </div>
          <span className="font-medium">{item.appName}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Notificación',
      render: (item: Notification) => (
        <div>
          <p className="font-medium truncate max-w-[200px]">{item.title}</p>
          <p className="text-sm text-[#A0AEC0] truncate max-w-[200px]">{item.content}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Hora',
      render: (item: Notification) => <span className="text-sm text-[#718096]">{formatTime(item.timestamp)}</span>,
    },
    {
      key: 'isRead',
      label: 'Estado',
      render: (item: Notification) => (
        <span className={`px-3 py-1.5 text-xs rounded-full font-medium ${item.isRead ? 'bg-[#F5F7FA] text-[#A0AEC0]' : 'bg-[#5B5FC7]/10 text-[#5B5FC7]'}`}>
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
          className="p-2 text-[#A0AEC0] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C]">Notificaciones</h1>
          <p className="text-[#718096] mt-2">{notifications.length} acumuladas</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#718096] hover:border-[#5B5FC7] hover:text-[#5B5FC7] transition-colors"
        >
          <RefreshCw size={18} />
          <span className="font-medium">Actualizar</span>
        </button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Buscar notificaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-[#1A202C] placeholder-[#A0AEC0] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 outline-none"
            />
          </div>
        </div>

        {isLoading.notifications ? (
          <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : errors.notifications ? (
          <EmptyState
            icon={<Bell size={48} />}
            title="Error al cargar"
            description={errors.notifications}
            action={<button onClick={fetchNotifications} className="px-5 py-3 bg-[#5B5FC7] text-white rounded-xl font-medium">Reintentar</button>}
          />
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.id} emptyMessage="Sin notificaciones" />
        )}
      </Card>
    </div>
  );
};