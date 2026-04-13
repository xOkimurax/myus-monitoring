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
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-[#E2E8F0] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#5B5FC7] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-semibold text-lg text-[#1A202C]">Myus</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-[#5B5FC7] text-white'
                      : 'text-[#718096] hover:bg-[#F5F7FA] hover:text-[#1A202C]'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <div className="mb-2 text-xs text-[#A0AEC0] truncate px-3">{user?.email}</div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-[#718096] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm"
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
    <div className="min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="ml-[240px] p-8">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};