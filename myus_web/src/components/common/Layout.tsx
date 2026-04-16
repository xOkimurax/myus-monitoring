import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Bell,
  Contact,
  Phone,
  MapPin,
  Folder,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/notifications', label: 'Notificaciones', icon: Bell },
  { path: '/contacts',      label: 'Contactos',      icon: Contact },
  { path: '/calls',         label: 'Llamadas',       icon: Phone },
  { path: '/locations',      label: 'Ubicación',      icon: MapPin },
  { path: '/files',         label: 'Archivos',        icon: Folder },
  { path: '/settings',      label: 'Configuración',  icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50"
      style={{ backgroundColor: '#0f1011', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#5e6ad2' }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
            </svg>
          </div>
          <span
            className="font-medium text-base tracking-tight"
            style={{ color: '#f7f8f8', letterSpacing: '-0.01em' }}
          >
            Myus
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'rgba(94,106,210,0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(94,106,210,0.3)' : '1px solid transparent',
                    color: isActive ? '#f7f8f8' : '#8a8f98',
                    fontWeight: isActive ? 510 : 400,
                    letterSpacing: isActive ? '-0.01em' : 'normal',
                  }}
                >
                  <item.icon
                    size={16}
                    style={{ color: isActive ? '#7170ff' : '#62666d' }}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          className="mb-2 px-3 text-xs truncate"
          style={{ color: '#62666d', fontWeight: 400 }}
        >
          {user?.email}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-all duration-150"
          style={{ color: '#62666d', fontWeight: 400 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#62666d';
          }}
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#08090a' }}>
      <Sidebar />
      <main
        className="ml-60 p-8"
        style={{ backgroundColor: '#08090a', minHeight: '100vh' }}
      >
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
