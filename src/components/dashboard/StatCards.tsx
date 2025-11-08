import React from 'react';
import { statCards } from '../../data/dashboard';
import { useAdminOverview } from '../../hooks/useAdminDashboard';
import type { AdminOverviewResponse } from '../../services/adminDashboard';

const StatCards: React.FC = () => {
  const { data, isLoading } = useAdminOverview();

  const metricsMap: Partial<AdminOverviewResponse['totals']> = data?.totals ?? {};

  if (isLoading) {
    return (
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div
            key={key}
            className="h-32 animate-pulse rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-800/70 dark:bg-slate-900/50"
          />
        ))}
      </section>
    );
  }

  return (
    <section id="overview" className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const trendColor =
          card.changeType === 'positive'
            ? 'text-emerald-500 bg-emerald-500/10'
            : 'text-rose-500 bg-rose-500/10';
        const rawValue = metricsMap[card.key as keyof typeof metricsMap];
        const valueText =
          typeof rawValue === 'number'
            ? card.formatter
              ? card.formatter(rawValue)
              : rawValue.toLocaleString()
            : card.value;

        return (
          <div
            key={card.name}
            className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {card.name}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{valueText}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-500 dark:text-indigo-400">
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${trendColor}`}>
              {card.changeType === 'positive' ? '▲' : '▼'} {card.change} this week
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatCards;


