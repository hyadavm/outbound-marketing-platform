import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'indigo'
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-lg bg-${color}-50 text-${color}-600 border border-${color}-100`}>
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};
