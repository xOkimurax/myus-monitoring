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
    <div className={`bg-white rounded-xl border border-[#E2E8F0] p-6 ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            {icon && <span className="text-[#5B5FC7]">{icon}</span>}
            {title && <h3 className="font-medium text-base text-[#1A202C]">{title}</h3>}
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
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#1A202C]">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${c.bg}`}>
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
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-3 border-[#5B5FC7] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-12 text-[#9CA3AF]">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E2E8F0]">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 px-4 text-sm text-[#4A5568]">
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
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-10 h-10' };
  return <div className={`animate-spin rounded-full border-3 border-[#5B5FC7] border-t-transparent ${sizes[size]}`} />;
};

export const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-[#CBD5E0] mb-3">{icon}</div>
    <h3 className="text-base font-medium text-[#4A5568] mb-1">{title}</h3>
    {description && <p className="text-sm text-[#9CA3AF] mb-4">{description}</p>}
    {action}
  </div>
);