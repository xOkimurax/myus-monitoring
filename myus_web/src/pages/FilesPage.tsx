import { useEffect, useState } from 'react';
import { Search, RefreshCw, Trash2, FolderOpen, File, Plus, Minus, Edit } from 'lucide-react';
import { Card, DataTable, LoadingSpinner, EmptyState, StatCard } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { filesApi } from '../api/endpoints';
import { FileEvent } from '../types';

export const FilesPage = () => {
  const { fileEvents, setFileEvents, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [operationFilter, setOperationFilter] = useState<string>('all');

  const fetchFileEvents = async () => {
    if (!user?.deviceId) return;
    setLoading('files', true);
    try {
      const response = await filesApi.getAll(user.deviceId);
      setFileEvents(response.data || []);
    } catch (err: any) {
      setError('files', err.message || 'Error al cargar archivos');
    } finally {
      setLoading('files', false);
    }
  };

  useEffect(() => {
    fetchFileEvents();
  }, [user?.deviceId]);

  const handleDelete = async (id: string) => {
    try {
      await filesApi.delete(id);
      setFileEvents(fileEvents.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Error deleting file event:', err);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(1)} GB`;
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

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'CREATE': return <Plus size={13} style={{ color: '#10b981' }} />;
      case 'DELETE': return <Minus size={13} style={{ color: '#ef4444' }} />;
      default:       return <Edit size={13} style={{ color: '#f59e0b' }} />;
    }
  };

  const getOperationLabel = (operation: string) => {
    switch (operation) {
      case 'CREATE': return 'Creado';
      case 'DELETE': return 'Eliminado';
      default:       return 'Modificado';
    }
  };

  const filteredFiles = fileEvents.filter((f) => {
    const matchesSearch =
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.filePath.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperation = operationFilter === 'all' || f.operation === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const stats = {
    total:    fileEvents.length,
    created:  fileEvents.filter((f) => f.operation === 'CREATE').length,
    deleted:  fileEvents.filter((f) => f.operation === 'DELETE').length,
    modified: fileEvents.filter((f) => f.operation === 'MODIFY').length,
  };

  const columns = [
    {
      key: 'operation',
      label: 'Operación',
      render: (item: FileEvent) => {
        const opColors: Record<string, { bg: string; text: string }> = {
          CREATE: { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
          DELETE: { bg: 'rgba(239,68,68,0.12)',    text: '#ef4444' },
          MODIFY: { bg: 'rgba(245,158,11,0.12)',   text: '#f59e0b' },
        };
        const c = opColors[item.operation as keyof typeof opColors] || opColors.MODIFY;
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: c.bg }}>
              {getOperationIcon(item.operation)}
            </div>
            <span className="text-sm font-medium" style={{ color: c.text }}>
              {getOperationLabel(item.operation)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'fileName',
      label: 'Archivo',
      render: (item: FileEvent) => (
        <div>
          <p
            className="font-medium text-sm truncate max-w-[220px]"
            style={{ color: '#f7f8f8' }}
          >
            {item.fileName}
          </p>
          <p
            className="text-xs truncate max-w-[220px] mt-0.5"
            style={{ color: '#62666d' }}
          >
            {item.filePath}
          </p>
        </div>
      ),
    },
    {
      key: 'fileSize',
      label: 'Tamaño',
      render: (item: FileEvent) => (
        <span className="text-sm" style={{ color: '#62666d' }}>
          {formatFileSize(item.fileSize)}
        </span>
      ),
    },
    {
      key: 'mimeType',
      label: 'Tipo',
      render: (item: FileEvent) => (
        <span
          className="px-2.5 py-1 text-xs rounded-full font-medium"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#8a8f98',
          }}
        >
          {item.mimeType?.split('/').pop() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: FileEvent) => (
        <span className="text-sm" style={{ color: '#62666d' }}>
          {formatTimestamp(item.timestamp)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: FileEvent) => (
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
    { key: 'all',    label: 'Todos' },
    { key: 'CREATE', label: 'Creados' },
    { key: 'MODIFY', label: 'Modificados' },
    { key: 'DELETE', label: 'Eliminados' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Archivos
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            {fileEvents.length} eventos registrados
          </p>
        </div>
        <button
          onClick={fetchFileEvents}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150"
          style={{ backgroundColor: '#5e6ad2' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <RefreshCw size={14} />
          Sincronizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total"       value={stats.total}    icon={<FolderOpen size={15} />} color="primary"   />
        <StatCard title="Creados"     value={stats.created}  icon={<Plus size={15} />}       color="secondary" />
        <StatCard title="Eliminados"  value={stats.deleted}  icon={<Minus size={15} />}      color="error"     />
        <StatCard title="Modificados" value={stats.modified} icon={<Edit size={15} />}        color="warning"   />
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
            placeholder="Buscar archivos…"
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
          {filterBtns.map((op) => (
            <button
              key={op.key}
              onClick={() => setOperationFilter(op.key)}
              className="px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-150"
              style={
                operationFilter === op.key
                  ? { backgroundColor: '#5e6ad2', color: '#ffffff' }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#8a8f98',
                    }
              }
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {isLoading.files ? (
        <div
          className="flex items-center justify-center py-16 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.files ? (
        <Card>
          <EmptyState
            icon={<File size={40} />}
            title="Error al cargar"
            description={errors.files}
            action={
              <button
                onClick={fetchFileEvents}
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
            data={filteredFiles}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay eventos de archivos"
          />
        </Card>
      )}
    </div>
  );
};
