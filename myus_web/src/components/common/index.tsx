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
    <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-8 ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            {icon && <span className="text-[#5B5FC7]">{icon}</span>}
            {title && <h3 className="font-semibold text-xl text-[#1A202C]">{title}</h3>}
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
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base text-[#718096] mb-2">{title}</p>
          <p className="text-4xl font-bold text-[#1A202C]">{value}</p>
        </div>
        <div className={`p-5 rounded-2xl ${c.bg}`}>
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
    return <div className="flex items-center justify-center py-24"><div className="w-12 h-12 border-4 border-[#5B5FC7] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-24 text-[#A0AEC0] text-lg">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E2E8F0]">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-5 px-6 text-base font-semibold text-[#718096]">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-b border-[#E2E8F0] hover:bg-[#F5F7FA] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-5 px-6 text-base text-[#1A202C]">
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
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return <div className={`animate-spin rounded-full border-4 border-[#5B5FC7] border-t-transparent ${sizes[size]}`} />;
};

export const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="text-[#A0AEC0] mb-6">{icon}</div>
    <h3 className="text-xl font-semibold text-[#1A202C] mb-3">{title}</h3>
    {description && <p className="text-base text-[#718096] mb-6">{description}</p>}
    {action}
  </div>
);