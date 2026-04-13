import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
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
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-5 border-b border-gray-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5B5FC7] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <span className="text-white font-semibold text-base">M</span>
              </div>
              <span className="font-semibold text-[#1F2937] text-xl">Myus</span>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-[#5B5FC7] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-semibold text-base">M</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#5B5FC7] text-white shadow-lg shadow-indigo-100'
                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1F2937]'
                    }`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Connection Status */}
        <div className={`px-4 pb-4 border-t border-gray-100 pt-4 ${collapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-2 text-xs text-[#9CA3AF] ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            {!collapsed && <span>Sync: {formatLastSync()}</span>}
          </div>
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100">
          {!collapsed && user && (
            <div className="mb-3 text-sm text-[#6B7280] truncate text-center">
              {user.email}
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-2 w-full px-4 py-3 text-[#6B7280] hover:bg-red-50 hover:text-red-600 rounded-xl transition-all text-sm font-medium ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Cerrar</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Sidebar />
      <main className="ml-64 min-h-screen p-6 lg:p-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};