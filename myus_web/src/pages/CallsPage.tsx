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
        return {
          icon: <ArrowDownLeft size={13} />,
          bg:   'rgba(16,185,129,0.12)',
          text: '#10b981',
          label: 'Entrante',
        };
      case 'OUTGOING':
        return {
          icon: <ArrowUpRight size={13} />,
          bg:   'rgba(94,106,210,0.12)',
          text: '#7170ff',
          label: 'Saliente',
        };
      default:
        return {
          icon: <XCircle size={13} />,
          bg:   'rgba(239,68,68,0.12)',
          text: '#ef4444',
          label: 'Perdida',
        };
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
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: info.bg }}>
              <span style={{ color: info.text }}>{info.icon}</span>
            </div>
            <span className="text-sm font-medium" style={{ color: info.text }}>
              {info.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'contactName',
      label: 'Contacto',
      render: (item: CallLog) => (
        <div>
          <p className="font-medium text-sm" style={{ color: '#f7f8f8' }}>
            {item.contactName || 'Desconocido'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#62666d' }}>
            {item.phoneNumber}
          </p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (item: CallLog) => (
        <span className="text-sm font-mono" style={{ color: '#8a8f98' }}>
          {formatDuration(item.duration)}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: CallLog) => (
        <span className="text-sm" style={{ color: '#62666d' }}>
          {formatTimestamp(item.timestamp)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: CallLog) => (
        <button
          onClick={() => handleDelete(item.id)}
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

  const filterBtns = [
    { key: 'all',      label: 'Todas' },
    { key: 'INCOMING', label: 'Entrantes' },
    { key: 'OUTGOING', label: 'Salientes' },
    { key: 'MISSED',   label: 'Perdidas' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Registro de Llamadas
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            {callLogs.length} llamadas registradas
          </p>
        </div>
        <button
          onClick={fetchCallLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150"
          style={{ backgroundColor: '#5e6ad2' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <RefreshCw size={14} />
          Sincronizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#62666d' }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o número…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="flex gap-1.5">
          {filterBtns.map((type) => (
            <button
              key={type.key}
              onClick={() => setTypeFilter(type.key)}
              className="px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-150"
              style={
                typeFilter === type.key
                  ? { backgroundColor: '#5e6ad2', color: '#ffffff' }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#8a8f98',
                    }
              }
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {isLoading.callLogs ? (
        <div
          className="flex items-center justify-center py-16 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.callLogs ? (
        <Card>
          <EmptyState
            icon={<Phone size={40} />}
            title="Error al cargar"
            description={errors.callLogs}
            action={
              <button
                onClick={fetchCallLogs}
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
            data={filteredCallLogs}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay llamadas registradas"
          />
        </Card>
      )}
    </div>
  );
};
