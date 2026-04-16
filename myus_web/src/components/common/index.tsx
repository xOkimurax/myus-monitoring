import type { ReactNode } from 'react';

/* =============================================
   Linear Design System — Common Components
   ============================================= */

interface CardProps {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Card = ({ title, children, icon, action, className = '' }: CardProps) => {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {(title || icon || action) && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            {icon && (
              <span style={{ color: '#7170ff' }}>{icon}</span>
            )}
            {title && (
              <h3
                className="text-sm font-medium"
                style={{ color: '#f7f8f8', fontWeight: 590, letterSpacing: '-0.01em' }}
              >
                {title}
              </h3>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-4">
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
    primary:   { bg: 'rgba(94,106,210,0.12)',   text: '#7170ff' },
    secondary: { bg: 'rgba(16,185,129,0.12)',   text: '#10b981' },
    warning:   { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
    error:     { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
  };

  const c = colors[color] || colors.primary;

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-xs mb-1 font-medium uppercase"
            style={{ color: '#62666d', letterSpacing: '0.04em' }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-medium"
            style={{ color: '#f7f8f8', letterSpacing: '-0.02em', fontWeight: 510 }}
          >
            {value}
          </p>
        </div>
        <div
          className="p-2.5 rounded-md"
          style={{ backgroundColor: c.bg }}
        >
          <span style={{ color: c.text }}>{icon}</span>
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

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Sin datos',
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: '#62666d', fontSize: '13px' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-2.5 px-4 text-xs font-medium uppercase"
                style={{ color: '#62666d', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item)}
              style={{
                borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-3 px-4 text-sm"
                  style={{ color: '#d0d6e0' }}
                >
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? '')}
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
  const sizes = { sm: 'w-4 h-4',   md: 'w-8 h-8',   lg: 'w-10 h-10' };
  const borders = { sm: 'border-2', md: 'border-[2.5px]', lg: 'border-[3px]' };
  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${sizes[size]} ${borders[size]}`}
      style={{ borderColor: '#5e6ad2', borderTopColor: 'transparent' }}
    />
  );
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 opacity-30" style={{ color: '#8a8f98' }}>{icon}</div>
    <h3 className="text-sm font-medium mb-1" style={{ color: '#d0d6e0' }}>{title}</h3>
    {description && (
      <p className="text-xs mb-5 max-w-xs" style={{ color: '#62666d' }}>{description}</p>
    )}
    {action}
  </div>
);
