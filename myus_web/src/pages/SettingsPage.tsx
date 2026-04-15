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
    syncInterval: 15,
    dataRetention: 30,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Configuración</h1>
          <p className="text-sm text-text-muted mt-1">Administra tu cuenta y preferencias</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25 disabled:opacity-60"
        >
          <Save size={16} />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Account Info */}
      <Card title="Información de la cuenta" icon={<Shield size={18} />}>
        <div className="space-y-3">
          {[
            { label: 'Email', value: user?.email || 'No disponible' },
            { label: 'ID de dispositivo', value: user?.deviceId || 'No disponible', mono: true },
            { label: 'Versión de la app', value: '1.0.0' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-background rounded-xl">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide">{item.label}</p>
                <p className={`font-medium mt-0.5 ${item.mono ? 'font-mono text-sm text-text-secondary' : 'text-text-primary'}`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Monitoring Settings */}
      <Card title="Configuración de monitoreo" icon={<Bell size={18} />}>
        <div className="space-y-3">
          {[
            {
              icon: Bell,
              iconColor: 'text-primary',
              title: 'Notificaciones',
              desc: 'Monitorear notificaciones del dispositivo',
              key: 'notificationsEnabled' as const,
            },
            {
              icon: Globe,
              iconColor: 'text-secondary',
              title: 'Seguimiento de ubicación',
              desc: 'GPS en tiempo real',
              key: 'locationTrackingEnabled' as const,
            },
            {
              icon: Database,
              iconColor: 'text-warning',
              title: 'Sincronización automática',
              desc: 'Sincronizar datos periódicamente',
              key: 'autoSync' as const,
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg bg-background ${item.iconColor}`}>
                  <item.icon size={17} />
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
              <Toggle
                checked={settings[item.key]}
                onChange={(v) => setSettings({ ...settings, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Gestión de datos" icon={<Database size={18} />}>
        <div className="space-y-5">
          {[
            { label: 'Intervalo de sincronización', key: 'syncInterval' as const, min: 5, max: 60, step: 5, unit: 'min' },
            { label: 'Retención de datos', key: 'dataRetention' as const, min: 7, max: 90, step: 7, unit: 'días' },
          ].map((slider) => (
            <div key={slider.key} className="p-4 bg-background rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-text-primary">{slider.label}</p>
                <span className="text-sm font-semibold text-primary">{settings[slider.key]} {slider.unit}</span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={settings[slider.key]}
                onChange={(e) => setSettings({ ...settings, [slider.key]: parseInt(e.target.value) })}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-1.5 text-xs text-text-muted">
                <span>{slider.min}</span>
                <span>{slider.max}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Zona de peligro" icon={<AlertTriangle size={18} className="text-error" />}>
        <div className="p-4 bg-error/5 border border-error/20 rounded-xl">
          <h4 className="font-semibold text-error text-sm mb-1.5">Eliminar todos los datos</h4>
          <p className="text-xs text-text-muted mb-4">
            Esta acción eliminará todos los datos sincronizados desde este dispositivo. No se puede deshacer.
          </p>
          <button className="px-4 py-2 bg-error hover:bg-error/80 text-white rounded-xl text-sm font-medium transition-colors">
            Eliminar todos los datos
          </button>
        </div>
      </Card>
    </div>
  );
};
