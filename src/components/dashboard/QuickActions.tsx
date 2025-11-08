import { quickActions } from '../../data/dashboard';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useAdminOverview } from '../../hooks/useAdminDashboard';

export const QuickActions: React.FC = () => {
  const { data } = useAdminOverview();
  const pendingProperties =
    data?.propertiesByStatus?.pending ?? quickActions[0].fallbackValue ?? 12;
  const flaggedDisputes = data?.bookingsByStatus?.pending ?? quickActions[1].fallbackValue ?? 5;

  const cards = [
    {
      ...quickActions[0],
      value: pendingProperties
    },
    {
      ...quickActions[1],
      value: flaggedDisputes
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 lg:col-span-2">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick actions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Manage high-priority tasks that need your attention.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((action) => (
          <div
            key={action.title}
            className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-800/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200">
                {action.value}
              </span>
            </div>
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
              {action.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;


