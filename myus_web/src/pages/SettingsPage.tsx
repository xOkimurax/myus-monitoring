import { useState } from 'react';
import { Save, Shield, Bell, Database, Globe, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    locationTrackingEnabled: true,
    autoSync: true,
    syncInterval: 15, // minutes
    dataRetention: 30, // days
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-gray-400 mt-1">Administra tu cuenta y preferencias</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Account Info */}
      <Card title="Información de la cuenta" icon={<Shield size={20} />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{user?.email || 'No disponible'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-400">ID de dispositivo</p>
              <p className="font-mono text-sm text-gray-300">{user?.deviceId || 'No disponible'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Versión de la app</p>
              <p className="font-medium">1.0.0</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Monitoring Settings */}
      <Card title="Configuración de monitoreo" icon={<Bell size={20} />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-primary" />
              <div>
                <p className="font-medium">Notificaciones</p>
                <p className="text-sm text-gray-400">Monitorear notificaciones del dispositivo</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-secondary" />
              <div>
                <p className="font-medium">Seguimiento de ubicación</p>
                <p className="text-sm text-gray-400">GPS en tiempo real</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.locationTrackingEnabled}
                onChange={(e) => setSettings({ ...settings, locationTrackingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-warning" />
              <div>
                <p className="font-medium">Sincronización automática</p>
                <p className="text-sm text-gray-400">Sincronizar datos periódicamente</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Gestión de datos" icon={<Database size={20} />}>
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Intervalo de sincronización</p>
              <span className="text-primary">{settings.syncInterval} min</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.syncInterval}
              onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Retención de datos</p>
              <span className="text-primary">{settings.dataRetention} días</span>
            </div>
            <input
              type="range"
              min="7"
              max="90"
              step="7"
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Zona de peligro" icon={<AlertTriangle size={20} />}>
        <div className="space-y-4">
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <h4 className="font-medium text-error mb-2">Eliminar todos los datos</h4>
            <p className="text-sm text-gray-400 mb-4">
              Esta acción eliminará todos los datos sincronizados desde este dispositivo. No se puede deshacer.
            </p>
            <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/80 transition-colors">
              Eliminar todos los datos
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};