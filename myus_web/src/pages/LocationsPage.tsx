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

  const formatCoordinates = (lat: number, lng: number) =>
    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ubicación</h1>
          <p className="text-sm text-text-muted mt-1">{locations.length} ubicaciones registradas</p>
        </div>
        <button
          onClick={fetchLocations}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Ubicaciones" value={locations.length} icon={<MapPin size={18} />} color="primary" />
        <StatCard
          title="Última Actualización"
          value={latestLocation ? formatTimestamp(latestLocation.timestamp) : 'N/A'}
          icon={<Clock size={18} />}
          color="secondary"
        />
        <StatCard
          title="Precisión Promedio"
          value={latestLocation?.accuracy ? `${latestLocation.accuracy.toFixed(0)}m` : 'N/A'}
          icon={<Target size={18} />}
          color="warning"
        />
      </div>

      {/* Latest Location Card */}
      {latestLocation && (
        <Card title="Ubicación Actual" icon={<Navigation size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Latitud', value: latestLocation.latitude.toFixed(6) },
              { label: 'Longitud', value: latestLocation.longitude.toFixed(6) },
              { label: 'Altitud', value: latestLocation.altitude ? `${latestLocation.altitude.toFixed(1)}m` : 'N/A' },
              { label: 'Precisión', value: latestLocation.accuracy ? `${latestLocation.accuracy.toFixed(1)}m` : 'N/A' },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-background rounded-xl">
                <p className="text-xs text-text-muted mb-1.5 font-medium uppercase tracking-wide">{item.label}</p>
                <p className="text-xl font-mono font-semibold text-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
          {latestLocation.speed !== undefined && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
              <Navigation size={16} className="text-primary" />
              <div>
                <p className="text-xs text-text-muted">Velocidad</p>
                <p className="font-semibold text-text-primary">
                  {latestLocation.speed > 0 ? `${(latestLocation.speed * 3.6).toFixed(1)} km/h` : 'Estático'}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Location History */}
      <Card title="Historial de Ubicaciones" icon={<Clock size={18} />}>
        {isLoading.locations ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.locations ? (
          <EmptyState
            icon={<MapPin size={48} />}
            title="Error al cargar"
            description={errors.locations}
            action={
              <button onClick={fetchLocations} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">
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
          <div className="space-y-2">
            {locations.slice(0, 20).map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-4 bg-background rounded-xl hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/15 rounded-lg">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-text-primary font-medium">
                      {formatCoordinates(location.latitude, location.longitude)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {location.accuracy ? `Precisión: ${location.accuracy.toFixed(0)}m` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted">{formatTimestamp(location.timestamp)}</p>
                  {location.speed !== undefined && (
                    <p className="text-xs text-primary font-medium">
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
