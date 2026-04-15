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
      case 'CREATE':
        return <Plus size={15} className="text-secondary" />;
      case 'DELETE':
        return <Minus size={15} className="text-error" />;
      default:
        return <Edit size={15} className="text-warning" />;
    }
  };

  const getOperationLabel = (operation: string) => {
    switch (operation) {
      case 'CREATE': return 'Creado';
      case 'DELETE': return 'Eliminado';
      default: return 'Modificado';
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
    total: fileEvents.length,
    created: fileEvents.filter((f) => f.operation === 'CREATE').length,
    deleted: fileEvents.filter((f) => f.operation === 'DELETE').length,
    modified: fileEvents.filter((f) => f.operation === 'MODIFY').length,
  };

  const columns = [
    {
      key: 'operation',
      label: 'Operación',
      render: (item: FileEvent) => {
        const opColors = {
          CREATE: { bg: 'bg-secondary/15', text: 'text-secondary' },
          DELETE: { bg: 'bg-error/15', text: 'text-error' },
          MODIFY: { bg: 'bg-warning/15', text: 'text-warning' },
        };
        const c = opColors[item.operation as keyof typeof opColors] || opColors.MODIFY;
        return (
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${c.bg}`}>{getOperationIcon(item.operation)}</div>
            <span className={`font-medium text-sm ${c.text}`}>{getOperationLabel(item.operation)}</span>
          </div>
        );
      },
    },
    {
      key: 'fileName',
      label: 'Archivo',
      render: (item: FileEvent) => (
        <div>
          <p className="font-medium text-text-primary text-sm truncate max-w-[220px]">{item.fileName}</p>
          <p className="text-xs text-text-muted truncate max-w-[220px]">{item.filePath}</p>
        </div>
      ),
    },
    {
      key: 'fileSize',
      label: 'Tamaño',
      render: (item: FileEvent) => (
        <span className="text-sm text-text-muted">{formatFileSize(item.fileSize)}</span>
      ),
    },
    {
      key: 'mimeType',
      label: 'Tipo',
      render: (item: FileEvent) => (
        <span className="px-2.5 py-1 text-xs bg-background text-text-muted rounded-full border border-border">
          {item.mimeType?.split('/').pop() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: FileEvent) => (
        <span className="text-sm text-text-muted">{formatTimestamp(item.timestamp)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: FileEvent) => (
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
          <h1 className="text-2xl font-bold text-text-primary">Archivos</h1>
          <p className="text-sm text-text-muted mt-1">{fileEvents.length} eventos registrados</p>
        </div>
        <button
          onClick={fetchFileEvents}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw size={16} />
          Sincronizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={<FolderOpen size={18} />} color="primary" />
        <StatCard title="Creados" value={stats.created} icon={<Plus size={18} />} color="secondary" />
        <StatCard title="Eliminados" value={stats.deleted} icon={<Minus size={18} />} color="error" />
        <StatCard title="Modificados" value={stats.modified} icon={<Edit size={18} />} color="warning" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'CREATE', label: 'Creados' },
            { key: 'MODIFY', label: 'Modificados' },
            { key: 'DELETE', label: 'Eliminados' },
          ].map((op) => (
            <button
              key={op.key}
              onClick={() => setOperationFilter(op.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                operationFilter === op.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/50'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {isLoading.files ? (
        <div className="flex items-center justify-center py-16 bg-surface rounded-xl border border-border">
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.files ? (
        <Card>
          <EmptyState
            icon={<File size={48} />}
            title="Error al cargar"
            description={errors.files}
            action={
              <button onClick={fetchFileEvents} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">
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
