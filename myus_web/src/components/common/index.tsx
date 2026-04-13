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
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {icon && <span className="text-[#5B5FC7]">{icon}</span>}
            {title && <h3 className="font-semibold text-lg text-[#1F2937]">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="">{children}</div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard = ({ title, value, icon, trend, color = 'primary' }: StatCardProps) => {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-[#5B5FC7]/10', text: 'text-[#5B5FC7]' },
    secondary: { bg: 'bg-[#7DD3C0]/10', text: 'text-[#7DD3C0]' },
    success: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]' },
    warning: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
    error: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' },
  };

  const styles = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280]">{title}</p>
          <p className="text-3xl font-bold mt-1 text-[#1F2937]">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.bg}`}>
          <span className={styles.text}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

interface DataTableProps<T> {
  columns: { key: keyof T | string; label: string; render?: (item: T) => ReactNode }[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay datos',
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-[#5B5FC7] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-[#9CA3AF]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left py-3 px-4 text-sm font-medium text-[#6B7280]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3.5 px-4 text-sm text-[#1F2937]">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-[#5B5FC7] border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-[#9CA3AF] mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#6B7280] mb-4">{description}</p>}
      {action}
    </div>
  );
};