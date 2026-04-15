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
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/notifications', label: 'Notificaciones', icon: Bell },
  { path: '/contacts', label: 'Contactos', icon: Contact },
  { path: '/calls', label: 'Llamadas', icon: Phone },
  { path: '/locations', label: 'Ubicación', icon: MapPin },
  { path: '/files', label: 'Archivos', icon: Folder },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-semibold text-lg text-text-primary tracking-tight">Myus</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-text-secondary hover:bg-background hover:text-text-primary'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-white' : ''} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="mb-2 px-3 text-xs text-text-muted truncate">{user?.email}</div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text-muted hover:bg-error/10 hover:text-error rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[240px] p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
