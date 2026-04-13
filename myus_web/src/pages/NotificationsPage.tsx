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
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#5B5FC7]/10 rounded-xl">
            <Bell size={18} className="text-[#5B5FC7]" />
          </div>
          <span className="font-medium text-base">{item.appName}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Notificación',
      render: (item: Notification) => (
        <div>
          <p className="font-medium text-base truncate max-w-[250px]">{item.title}</p>
          <p className="text-sm text-[#A0AEC0] truncate max-w-[250px]">{item.content}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Hora',
      render: (item: Notification) => <span className="text-base text-[#718096]">{formatTime(item.timestamp)}</span>,
    },
    {
      key: 'isRead',
      label: 'Estado',
      render: (item: Notification) => (
        <span className={`px-4 py-2 text-sm rounded-full font-medium ${item.isRead ? 'bg-[#F5F7FA] text-[#A0AEC0]' : 'bg-[#5B5FC7]/10 text-[#5B5FC7]'}`}>
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
          className="p-3 text-[#A0AEC0] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1A202C]">Notificaciones</h1>
          <p className="text-[#718096] mt-3 text-lg">{notifications.length} acumuladas</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-3 px-6 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-[#718096] hover:border-[#5B5FC7] hover:text-[#5B5FC7] transition-colors font-medium text-base"
        >
          <RefreshCw size={20} />
          <span>Actualizar</span>
        </button>
      </div>

      <Card>
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Buscar notificaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-[#F5F7FA] border border-[#E2E8F0] rounded-2xl text-[#1A202C] placeholder-[#A0AEC0] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 outline-none text-base"
            />
          </div>
        </div>

        {isLoading.notifications ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : errors.notifications ? (
          <EmptyState
            icon={<Bell size={56} />}
            title="Error al cargar"
            description={errors.notifications}
            action={<button onClick={fetchNotifications} className="px-6 py-4 bg-[#5B5FC7] text-white rounded-2xl font-semibold text-base">Reintentar</button>}
          />
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.id} emptyMessage="Sin notificaciones" />
        )}
      </Card>
    </div>
  );
};