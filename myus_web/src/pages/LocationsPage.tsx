import { useEffect, useState } from 'react';
import { RefreshCw, MapPin, Clock, Navigation, Target } from 'lucide-react';
import { Card, LoadingSpinner, EmptyState, StatCard } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { locationsApi } from '../api/endpoints';
import { Location } from '../types';

export const LocationsPage = () => {
  const { locations, setLocations, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [latestLocation, setLatestLocation] = useState<Location | null>(null);

  const fetchLocations = async () => {
    if (!user?.deviceId) return;
    setLoading('locations', true);
    try {
      const response = await locationsApi.getAll(user.deviceId);
      setLocations(response.data || []);
      if (response.data?.length > 0) {
        setLatestLocation(response.data[0]);
      }
    } catch (err: any) {
      setError('locations', err.message || 'Error al cargar ubicaciones');
    } finally {
      setLoading('locations', false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [user?.deviceId]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    return date.toLocaleString('es-ES');
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ubicación</h1>
          <p className="text-gray-400 mt-1">{locations.length} ubicaciones registradas</p>
        </div>
        <button
          onClick={fetchLocations}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="TotalUbicaciones"
          value={locations.length}
          icon={<MapPin size={24} />}
          color="primary"
        />
        <StatCard
          title="Última actualización"
          value={latestLocation ? formatTimestamp(latestLocation.timestamp) : 'N/A'}
          icon={<Clock size={24} />}
          color="secondary"
        />
        <StatCard
          title="Precisión promedio"
          value={latestLocation?.accuracy ? `${latestLocation.accuracy.toFixed(0)}m` : 'N/A'}
          icon={<Target size={24} />}
          color="warning"
        />
      </div>

      {/* Latest Location Card */}
      {latestLocation && (
        <Card title="Ubicación Actual" icon={<Navigation size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Latitud</p>
                <p className="text-xl font-mono">{latestLocation.latitude.toFixed(6)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Longitud</p>
                <p className="text-xl font-mono">{latestLocation.longitude.toFixed(6)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Altitud</p>
                <p className="text-xl font-mono">
                  {latestLocation.altitude ? `${latestLocation.altitude.toFixed(1)}m` : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Precisión</p>
                <p className="text-xl font-mono">
                  {latestLocation.accuracy ? `${latestLocation.accuracy.toFixed(1)}m` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-gray-400">Última actualización</p>
            <p className="font-medium">{formatTimestamp(latestLocation.timestamp)}</p>
          </div>
        </Card>
      )}

      {/* Location History */}
      <Card title="Historial de Ubicaciones" icon={<Clock size={20} />}>
        {isLoading.locations ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.locations ? (
          <EmptyState
            icon={<MapPin size={48} />}
            title="Error al cargar"
            description={errors.locations}
            action={
              <button
                onClick={fetchLocations}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reintentar
              </button>
            }
          />
        ) : locations.length === 0 ? (
          <EmptyState
            icon={<MapPin size={48} />}
            title="Sin ubicaciones"
            description="Aún no se han registrado ubicaciones"
          />
        ) : (
          <div className="space-y-3">
            {locations.slice(0, 20).map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium font-mono text-sm">
                      {formatCoordinates(location.latitude, location.longitude)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {location.accuracy ? `Precisión: ${location.accuracy.toFixed(0)}m` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{formatTimestamp(location.timestamp)}</p>
                  {location.speed && (
                    <p className="text-xs text-primary">
                      {location.speed > 0 ? `${(location.speed * 3.6).toFixed(1)} km/h` : 'Estático'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};