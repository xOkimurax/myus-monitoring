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
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col">
      {/* Logo */}
      <div className="px-8 py-8 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5B5FC7] rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-bold text-2xl text-[#1A202C]">Myus</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-6">
        <ul className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium text-base transition-colors ${
                    isActive
                      ? 'bg-[#5B5FC7] text-white shadow-md'
                      : 'text-[#718096] hover:bg-[#F5F7FA] hover:text-[#1A202C]'
                  }`}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-5 py-6 border-t border-[#E2E8F0]">
        <div className="mb-4 text-base text-[#718096] truncate px-5">{user?.email}</div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-5 py-4 text-[#718096] hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors font-medium text-base"
        >
          <LogOut size={22} />
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
      <main className="ml-[280px] p-12">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};