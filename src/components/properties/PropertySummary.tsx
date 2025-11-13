import { Building, Clock3, Home, Star } from 'lucide-react';
import type { AdminPropertySummary } from '../../services/types';

interface PropertySummaryProps {
  summary?: AdminPropertySummary;
  isLoading?: boolean;
}

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: typeof Building;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900/60">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-500/10" />
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        {subtitle ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-200">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const SkeletonSummary = () => (
  <div className="grid gap-4 md:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60"
      />
    ))}
  </div>
);

export const PropertySummary = ({ summary, isLoading }: PropertySummaryProps) => {
  if (isLoading) {
    return <SkeletonSummary />;
  }

  if (!summary) {
    return null;
  }

  const statusEntries = Object.entries(summary.byStatus || {});
  const listingEntries = Object.entries(summary.byListingType || {});

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total properties"
          value={summary.totals.totalProperties || 0}
          subtitle="Across every listing type"
          icon={Building}
        />
        <SummaryCard
          title="Pending approval"
          value={summary.totals.pendingApproval || 0}
          subtitle="Awaiting moderation"
          icon={Clock3}
        />
        <SummaryCard
          title="Featured"
          value={summary.totals.featuredProperties || 0}
          subtitle="Highlighted on the marketplace"
          icon={Star}
        />
        <SummaryCard
          title="Active listings"
          value={summary.byStatus?.active || 0}
          subtitle="Currently visible to users"
          icon={Home}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Status distribution</h3>
          <div className="mt-4 space-y-3">
            {statusEntries.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No status data available yet.</p>
            ) : (
              statusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-500 dark:text-slate-400">{status.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Listing type mix</h3>
          <div className="mt-4 space-y-3">
            {listingEntries.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No listing data available yet.</p>
            ) : (
              listingEntries.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-500 dark:text-slate-400">{type}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySummary;



