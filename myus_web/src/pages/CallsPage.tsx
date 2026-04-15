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

  const getCallInfo = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return { icon: <ArrowDownLeft size={15} className="text-secondary" />, bg: 'bg-secondary/15', text: 'text-secondary', label: 'Entrante' };
      case 'OUTGOING':
        return { icon: <ArrowUpRight size={15} className="text-primary" />, bg: 'bg-primary/15', text: 'text-primary', label: 'Saliente' };
      default:
        return { icon: <XCircle size={15} className="text-error" />, bg: 'bg-error/15', text: 'text-error', label: 'Perdida' };
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
      render: (item: CallLog) => {
        const info = getCallInfo(item.type);
        return (
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${info.bg}`}>{info.icon}</div>
            <span className={`font-medium text-sm ${info.text}`}>{info.label}</span>
          </div>
        );
      },
    },
    {
      key: 'contactName',
      label: 'Contacto',
      render: (item: CallLog) => (
        <div>
          <p className="font-medium text-text-primary text-sm">{item.contactName || 'Desconocido'}</p>
          <p className="text-xs text-text-muted">{item.phoneNumber}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (item: CallLog) => (
        <span className="text-sm text-text-muted font-mono">{formatDuration(item.duration)}</span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: CallLog) => (
        <span className="text-sm text-text-muted">{formatTimestamp(item.timestamp)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: CallLog) => (
        <button
          onClick={() => handleDelete(item.id)}
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
          <h1 className="text-2xl font-bold text-text-primary">Registro de Llamadas</h1>
          <p className="text-sm text-text-muted mt-1">{callLogs.length} llamadas registradas</p>
        </div>
        <button
          onClick={fetchCallLogs}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw size={16} />
          Sincronizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'INCOMING', label: 'Entrantes' },
            { key: 'OUTGOING', label: 'Salientes' },
            { key: 'MISSED', label: 'Perdidas' },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setTypeFilter(type.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                typeFilter === type.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {isLoading.callLogs ? (
        <div className="flex items-center justify-center py-16 bg-surface rounded-xl border border-border">
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.callLogs ? (
        <Card>
          <EmptyState
            icon={<Phone size={48} />}
            title="Error al cargar"
            description={errors.callLogs}
            action={
              <button onClick={fetchCallLogs} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">
                Reintentar
              </button>
            }
          />
        </Card>
      ) : (
        <Card className="p-0">
          <DataTable
            columns={columns}
            data={filteredCallLogs}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay llamadas registradas"
          />
        </Card>
      )}
    </div>
  );
};
