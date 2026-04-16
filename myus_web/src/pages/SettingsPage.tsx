import { useState } from 'react';
import { Save, Shield, Bell, Database, Globe, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notificationsEnabled:     true,
    locationTrackingEnabled:   true,
    autoSync:                  true,
    syncInterval:              15,
    dataRetention:             30,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 focus:outline-none"
      style={{
        backgroundColor: checked ? '#5e6ad2' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full shadow-sm transition-transform duration-150"
        style={{
          backgroundColor: checked ? '#ffffff' : '#62666d',
          transform: checked ? 'translateX(22px)' : 'translateX(3px)',
        }}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Configuración
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            Administra tu cuenta y preferencias
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150 disabled:opacity-50"
          style={{ backgroundColor: '#5e6ad2' }}
          onMouseEnter={(e) => { if (!isSaving) (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <Save size={14} />
          {isSaving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>

      {/* Account Info */}
      <Card title="Información de la cuenta" icon={<Shield size={15} />}>
        <div className="space-y-1.5">
          {[
            { label: 'Email',         value: user?.email || 'No disponible' },
            { label: 'ID de dispositivo', value: user?.deviceId || 'No disponible' },
            { label: 'Versión de la app', value: '1.0.0' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3.5 rounded-md"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <p
                  className="text-xs font-medium uppercase"
                  style={{ color: '#62666d', letterSpacing: '0.04em' }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-0.5 text-sm font-medium"
                  style={{
                    color: '#f7f8f8',
                    fontFamily: item.label === 'ID de dispositivo' ? 'ui-monospace, monospace' : 'inherit',
                    fontSize: item.label === 'ID de dispositivo' ? '12px' : '14px',
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Monitoring Settings */}
      <Card title="Configuración de monitoreo" icon={<Bell size={15} />}>
        <div className="space-y-1.5">
          {[
            {
              icon: Bell,
              iconColor: '#7170ff',
              title: 'Notificaciones',
              desc: 'Monitorear notificaciones del dispositivo',
              key: 'notificationsEnabled' as const,
            },
            {
              icon: Globe,
              iconColor: '#10b981',
              title: 'Seguimiento de ubicación',
              desc: 'GPS en tiempo real',
              key: 'locationTrackingEnabled' as const,
            },
            {
              icon: Database,
              iconColor: '#f59e0b',
              title: 'Sincronización automática',
              desc: 'Sincronizar datos periódicamente',
              key: 'autoSync' as const,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-md"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-md"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <item.icon size={15} style={{ color: item.iconColor }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#f7f8f8' }}>
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#62666d' }}>
                    {item.desc}
                  </p>
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
      <Card title="Gestión de datos" icon={<Database size={15} />}>
        <div className="space-y-5">
          {[
            {
              label:     'Intervalo de sincronización',
              key:       'syncInterval' as const,
              min: 5, max: 60, step: 5, unit: 'min',
            },
            {
              label:     'Retención de datos',
              key:       'dataRetention' as const,
              min: 7, max: 90, step: 7, unit: 'días',
            },
          ].map((slider) => (
            <div
              key={slider.key}
              className="p-4 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: '#f7f8f8' }}>
                  {slider.label}
                </p>
                <span className="text-sm font-medium" style={{ color: '#7170ff' }}>
                  {settings[slider.key]} {slider.unit}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={settings[slider.key]}
                onChange={(e) =>
                  setSettings({ ...settings, [slider.key]: parseInt(e.target.value) })
                }
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#5e6ad2', backgroundColor: 'rgba(255,255,255,0.1)' }}
              />
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#62666d' }}>
                <span>{slider.min}</span>
                <span>{slider.max}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Zona de peligro" icon={<AlertTriangle size={15} style={{ color: '#ef4444' }} />}>
        <div
          className="p-4 rounded-md"
          style={{
            backgroundColor: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <h4 className="font-semibold text-sm mb-1.5" style={{ color: '#ef4444' }}>
            Eliminar todos los datos
          </h4>
          <p className="text-xs mb-4" style={{ color: '#62666d' }}>
            Esta acción eliminará todos los datos sincronizados desde este dispositivo.
            No se puede deshacer.
          </p>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = 'rgba(239,68,68,0.15)';
              el.style.borderColor = 'rgba(239,68,68,0.35)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = 'rgba(239,68,68,0.1)';
              el.style.borderColor = 'rgba(239,68,68,0.25)';
            }}
          >
            Eliminar todos los datos
          </button>
        </div>
      </Card>
    </div>
  );
};
