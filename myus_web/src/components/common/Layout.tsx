import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMonitoringStore } from '../../store/monitoringStore';

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
  const { lastSync } = useMonitoringStore();
  const [collapsed, setCollapsed] = useState(false);

  const formatLastSync = () => {
    if (!lastSync) return 'Nunca';
    const diff = Date.now() - lastSync;
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r-2 border-gray-100 transition-all duration-300 z-50 shadow-xl ${
        collapsed ? 'w-24' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-6 border-b-2 border-gray-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5B5FC7] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-2xl text-[#1F2937]">Myus</span>
            </div>
          )}
          {collapsed && (
            <div className="w-12 h-12 bg-[#5B5FC7] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl">M</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium text-lg ${
                      isActive
                        ? 'bg-[#5B5FC7] text-white shadow-lg shadow-indigo-200'
                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1F2937]'
                    }`}
                  >
                    <item.icon size={24} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sync Status */}
        {!collapsed && (
          <div className="px-6 py-4 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse" />
              <span>Sincronizado: {formatLastSync()}</span>
            </div>
          </div>
        )}

        {/* User & Logout */}
        <div className="p-5 border-t-2 border-gray-100">
          {!collapsed && user && (
            <div className="mb-4 text-base text-[#6B7280] truncate text-center font-medium">
              {user.email}
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-5 py-4 text-[#6B7280] hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all font-medium text-lg ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={24} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-28 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Sidebar />
      <main className="ml-72 min-h-screen p-10">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};