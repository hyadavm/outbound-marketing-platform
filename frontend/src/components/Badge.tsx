import React from 'react';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toLowerCase()) {
    case 'new':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'contacted':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'qualified':
      colorClasses = 'bg-violet-50 text-violet-700 border-violet-200';
      break;
    case 'converted':
    case 'active':
    case 'opened':
    case 'clicked':
    case 'replied':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'unsubscribed':
    case 'paused':
    case 'bounced':
    case 'failed':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'draft':
    case 'pending':
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
    default:
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {status}
    </span>
  );
};
