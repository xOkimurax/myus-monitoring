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
        return <Plus size={16} className="text-success" />;
      case 'DELETE':
        return <Minus size={16} className="text-error" />;
      default:
        return <Edit size={16} className="text-warning" />;
    }
  };

  const getOperationLabel = (operation: string) => {
    switch (operation) {
      case 'CREATE':
        return 'Creado';
      case 'DELETE':
        return 'Eliminado';
      default:
        return 'Modificado';
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
      render: (item: FileEvent) => (
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            item.operation === 'CREATE' ? 'bg-success/10' :
            item.operation === 'DELETE' ? 'bg-error/10' : 'bg-warning/10'
          }`}>
            {getOperationIcon(item.operation)}
          </div>
          <span className={`font-medium ${
            item.operation === 'CREATE' ? 'text-success' :
            item.operation === 'DELETE' ? 'text-error' : 'text-warning'
          }`}>
            {getOperationLabel(item.operation)}
          </span>
        </div>
      ),
    },
    {
      key: 'fileName',
      label: 'Archivo',
      render: (item: FileEvent) => (
        <div>
          <p className="font-medium truncate max-w-xs">{item.fileName}</p>
          <p className="text-xs text-gray-400 truncate max-w-xs">{item.filePath}</p>
        </div>
      ),
    },
    {
      key: 'fileSize',
      label: 'Tamaño',
      render: (item: FileEvent) => (
        <span className="text-sm text-gray-400">{formatFileSize(item.fileSize)}</span>
      ),
    },
    {
      key: 'mimeType',
      label: 'Tipo',
      render: (item: FileEvent) => (
        <span className="px-2 py-1 text-xs bg-gray-700 rounded-full truncate max-w-xs">
          {item.mimeType || 'Desconocido'}
        </span>
      ),
    },
    {
      key: 'timestamp',
      label: 'Fecha',
      render: (item: FileEvent) => (
        <span className="text-sm text-gray-400">{formatTimestamp(item.timestamp)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: FileEvent) => (
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
          <h1 className="text-2xl font-bold">Archivos</h1>
          <p className="text-gray-400 mt-1">{fileEvents.length} eventos registrados</p>
        </div>
        <button
          onClick={fetchFileEvents}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={18} />
          Sincronizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={<FolderOpen size={24} />} color="primary" />
        <StatCard title="Creados" value={stats.created} icon={<Plus size={24} />} color="success" />
        <StatCard title="Eliminados" value={stats.deleted} icon={<Minus size={24} />} color="error" />
        <StatCard title="Modificados" value={stats.modified} icon={<Edit size={24} />} color="warning" />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'CREATE', 'MODIFY', 'DELETE'].map((op) => (
              <button
                key={op}
                onClick={() => setOperationFilter(op)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  operationFilter === op
                    ? 'bg-primary text-white'
                    : 'bg-background border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {op === 'all' ? 'Todos' : getOperationLabel(op)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading.files ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.files ? (
          <EmptyState
            icon={<File size={48} />}
            title="Error al cargar"
            description={errors.files}
            action={
              <button
                onClick={fetchFileEvents}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reintentar
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredFiles}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay eventos de archivos"
          />
        )}
      </Card>
    </div>
  );
};