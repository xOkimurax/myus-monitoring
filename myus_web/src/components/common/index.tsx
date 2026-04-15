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
    <div className={`bg-surface rounded-xl border border-border ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {icon && <span className="text-primary">{icon}</span>}
            {title && <h3 className="font-semibold text-sm text-text-primary">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
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
    primary: { bg: 'bg-primary/15', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/15', text: 'text-secondary' },
    warning: { bg: 'bg-warning/15', text: 'text-warning' },
    error: { bg: 'bg-error/15', text: 'text-error' },
  };

  const c = colors[color] || colors.primary;

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-background">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-t border-border hover:bg-background/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 px-4 text-sm text-text-secondary">
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
  const borders = { sm: 'border-2', md: 'border-[3px]', lg: 'border-4' };
  return (
    <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizes[size]} ${borders[size]}`} />
  );
};

export const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-text-muted mb-4 opacity-40">{icon}</div>
    <h3 className="text-sm font-semibold text-text-secondary mb-1">{title}</h3>
    {description && <p className="text-xs text-text-muted mb-5 max-w-xs">{description}</p>}
    {action}
  </div>
);
