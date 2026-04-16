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
    if (diff < 60000)     return 'Ahora';
    if (diff < 3600000)   return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000)  return `Hace ${Math.floor(diff / 3600000)} h`;
    return date.toLocaleString('es-ES');
  };

  const formatCoordinates = (lat: number, lng: number) =>
    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Ubicación
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            {locations.length} ubicaciones registradas
          </p>
        </div>
        <button
          onClick={fetchLocations}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150"
          style={{ backgroundColor: '#5e6ad2' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard
          title="Total Ubicaciones"
          value={locations.length}
          icon={<MapPin size={15} />}
          color="primary"
        />
        <StatCard
          title="Última Actualización"
          value={latestLocation ? formatTimestamp(latestLocation.timestamp) : 'N/A'}
          icon={<Clock size={15} />}
          color="secondary"
        />
        <StatCard
          title="Precisión Promedio"
          value={latestLocation?.accuracy ? `${latestLocation.accuracy.toFixed(0)}m` : 'N/A'}
          icon={<Target size={15} />}
          color="warning"
        />
      </div>

      {/* Latest Location Card */}
      {latestLocation && (
        <Card title="Ubicación Actual" icon={<Navigation size={15} />}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Latitud',  value: latestLocation.latitude.toFixed(6) },
              { label: 'Longitud', value: latestLocation.longitude.toFixed(6) },
              { label: 'Altitud',  value: latestLocation.altitude ? `${latestLocation.altitude.toFixed(1)}m` : 'N/A' },
              { label: 'Precisión',value: latestLocation.accuracy ? `${latestLocation.accuracy.toFixed(1)}m` : 'N/A' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  className="text-xs font-medium uppercase mb-1.5"
                  style={{ color: '#62666d', letterSpacing: '0.04em' }}
                >
                  {item.label}
                </p>
                <p
                  className="font-mono text-lg font-medium"
                  style={{ color: '#f7f8f8', letterSpacing: '-0.02em' }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          {latestLocation.speed !== undefined && (
            <div
              className="mt-3 p-3.5 rounded-md flex items-center gap-3"
              style={{
                backgroundColor: 'rgba(94,106,210,0.08)',
                border: '1px solid rgba(94,106,210,0.2)',
              }}
            >
              <Navigation size={14} style={{ color: '#7170ff' }} />
              <div>
                <p className="text-xs" style={{ color: '#62666d' }}>Velocidad</p>
                <p className="font-medium text-sm" style={{ color: '#f7f8f8' }}>
                  {latestLocation.speed > 0
                    ? `${(latestLocation.speed * 3.6).toFixed(1)} km/h`
                    : 'Estático'}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Location History */}
      <Card title="Historial de Ubicaciones" icon={<Clock size={15} />}>
        {isLoading.locations ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.locations ? (
          <EmptyState
            icon={<MapPin size={40} />}
            title="Error al cargar"
            description={errors.locations}
            action={
              <button
                onClick={fetchLocations}
                className="px-4 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: '#5e6ad2' }}
              >
                Reintentar
              </button>
            }
          />
        ) : locations.length === 0 ? (
          <EmptyState
            icon={<MapPin size={40} />}
            title="Sin ubicaciones"
            description="Aún no se han registrado ubicaciones"
          />
        ) : (
          <div className="space-y-1">
            {locations.slice(0, 20).map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-3 rounded-md transition-colors duration-150"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  el.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = 'transparent';
                  el.style.borderColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-md"
                    style={{ backgroundColor: 'rgba(94,106,210,0.1)' }}
                  >
                    <MapPin size={14} style={{ color: '#7170ff' }} />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium" style={{ color: '#f7f8f8' }}>
                      {formatCoordinates(location.latitude, location.longitude)}
                    </p>
                    <p className="text-xs" style={{ color: '#62666d' }}>
                      {location.accuracy ? `Precisión: ${location.accuracy.toFixed(0)}m` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#62666d' }}>
                    {formatTimestamp(location.timestamp)}
                  </p>
                  {location.speed !== undefined && (
                    <p className="text-xs font-medium" style={{ color: '#7170ff' }}>
                      {location.speed > 0
                        ? `${(location.speed * 3.6).toFixed(1)} km/h`
                        : 'Estático'}
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
