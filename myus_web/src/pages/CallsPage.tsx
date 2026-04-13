import { useEffect, useState } from 'react';
import { Search, RefreshCw, Trash2, Phone, ArrowDownLeft, ArrowUpRight, XCircle } from 'lucide-react';
import { Card, DataTable, LoadingSpinner, EmptyState } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { callLogsApi } from '../api/endpoints';
import type { CallLog } from '../types';

export const CallsPage = () => {
  const { callLogs, setCallLogs, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchCallLogs = async () => {
    if (!user?.deviceId) return;
    setLoading('callLogs', true);
    try {
      const response = await callLogsApi.getAll(user.deviceId);
      setCallLogs(response.data || []);
    } catch (err: any) {
      setError('callLogs', err.message || 'Error al cargar llamadas');
    } finally {
      setLoading('callLogs', false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, [user?.deviceId]);

  const handleDelete = async (id: string) => {
    try {
      await callLogsApi.delete(id);
      setCallLogs(callLogs.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting call log:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return <ArrowDownLeft size={16} className="text-success" />;
      case 'OUTGOING':
        return <ArrowUpRight size={16} className="text-primary" />;
      default:
        return <XCircle size={16} className="text-error" />;
    }
  };

  const getCallTypeLabel = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return 'Entrante';
      case 'OUTGOING':
        return 'Saliente';
      default:
        return 'Perdida';
    }
  };

  const filteredCallLogs = callLogs.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery);
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      key: 'type',
      label: 'Tipo',
      render: (item: CallLog) => (
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            item.type === 'INCOMING' ? 'bg-success/10' :
            item.type === 'OUTGOING' ? 'bg-primary/10' : 'bg-error/10'
          }`}>
            {getCallIcon(item.type)}
          </div>
          <span className={`font-medium ${
            item.type === 'INCOMING' ? 'text-success' :
            item.type === 'OUTGOING' ? 'text-primary' : 'text-error'
          }`}>
            {getCallTypeLabel(item.type)}
          </span>
        </div>
      ),
    },
    {
      key: 'contactName',
      label: 'Contacto',
      render: (item: CallLog) => (
        <div>
          <p className="font-medium">{item.contactName || 'Desconocido'}</p>
          <p className="text-sm text-gray-400">{item.phoneNumber}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (item: CallLog) => (
        <span className="text-sm">{formatDuration(item.duration)}</span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: CallLog) => (
        <span className="text-sm text-gray-400">{formatTimestamp(item.timestamp)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: CallLog) => (
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
          <h1 className="text-2xl font-bold">Registro de Llamadas</h1>
          <p className="text-gray-400 mt-1">{callLogs.length} llamadas registradas</p>
        </div>
        <button
          onClick={fetchCallLogs}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={18} />
          Sincronizar
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'INCOMING', 'OUTGOING', 'MISSED'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === type
                    ? 'bg-primary text-white'
                    : 'bg-background border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'Todas' : getCallTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading.callLogs ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.callLogs ? (
          <EmptyState
            icon={<Phone size={48} />}
            title="Error al cargar"
            description={errors.callLogs}
            action={
              <button
                onClick={fetchCallLogs}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reintentar
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredCallLogs}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay llamadas registradas"
          />
        )}
      </Card>
    </div>
  );
};