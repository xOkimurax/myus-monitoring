import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Card = ({ title, children, icon, action, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-7 ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            {icon && <span className="text-[#5B5FC7]">{icon}</span>}
            {title && <h3 className="font-semibold text-lg text-[#1A202C]">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export const StatCard = ({ title, value, icon, color = 'primary' }: StatCardProps) => {
  const colors: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-[#5B5FC7]/10', text: 'text-[#5B5FC7]' },
    secondary: { bg: 'bg-[#48BB78]/10', text: 'text-[#48BB78]' },
    warning: { bg: 'bg-[#ED8936]/10', text: 'text-[#ED8936]' },
    error: { bg: 'bg-[#E53E3E]/10', text: 'text-[#E53E3E]' },
  };

  const c = colors[color] || colors.primary;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#718096] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#1A202C]">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${c.bg}`}>
          <span className={c.text}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

interface DataTableProps<T> {
  columns: { key: string; label: string; render?: (item: T) => ReactNode }[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = 'Sin datos', loading = false }: DataTableProps<T>) {
  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#5B5FC7] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-20 text-[#A0AEC0]">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E2E8F0]">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-4 px-5 text-sm font-semibold text-[#718096]">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-b border-[#E2E8F0] hover:bg-[#F5F7FA] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-5 text-sm text-[#1A202C]">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`animate-spin rounded-full border-4 border-[#5B5FC7] border-t-transparent ${sizes[size]}`} />;
};

export const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-[#A0AEC0] mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-[#1A202C] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#718096] mb-4">{description}</p>}
    {action}
  </div>
);