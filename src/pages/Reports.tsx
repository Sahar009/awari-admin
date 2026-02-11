import { useMemo, useState } from 'react';
import {
  Loader,
  TrendingUp,
  Users,
  Building2,
  RefreshCw,
  BookOpen,
  PieChart,
  Layers
} from 'lucide-react';
import { useReportsMetrics } from '../hooks/useReports';
import { ActionButton } from '../components/ui/ActionButton';
import LineChart from '../components/charts/LineChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import type {
  ReportsMetricsResponse,
  ReportsRevenuePoint
} from '../services/types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: value >= 1000000 ? 0 : 2
  }).format(value || 0);

const formatNumber = (value: number) => value.toLocaleString();

interface BreakdownListProps {
  title: string;
  data: Record<string, number>;
  total?: number;
  palette?: string[];
}

const defaultPalette = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500'];

const BreakdownList = ({ title, data, total, palette = defaultPalette }: BreakdownListProps) => {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const sum = (total ?? entries.reduce((acc, [, value]) => acc + value, 0)) || 1;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <PieChart className="h-4 w-4 text-indigo-500" />
        {title}
      </div>
      <ul className="mt-4 space-y-3">
        {entries.map(([key, value], index) => {
          const percent = Math.round((value / sum) * 1000) / 10;
          const color = palette[index % palette.length];
          return (
            <li key={key} className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">{key.replaceAll('_', ' ')}</span>
                <span className="text-slate-500 dark:text-slate-400">{value.toLocaleString()} ({percent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/80">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
              </div>
            </li>
          );
        })}
        {!entries.length && <li className="text-xs text-slate-400 dark:text-slate-500">No data</li>}
      </ul>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/70">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const ReportsPage = () => {
  const [months, setMonths] = useState(6);
  const { data, isLoading, isFetching, refetch } = useReportsMetrics({ months });

  const metrics = data as ReportsMetricsResponse | undefined;

  const totals = metrics?.insights.totals;

  const userGrowth = metrics?.charts.userGrowth ?? [];
  const revenueTrend = metrics?.charts.revenueTrend ?? [];
  const bookingTrend = metrics?.charts.bookingTrend ?? [];

  const breakdowns = metrics?.breakdowns;

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total revenue (period)',
        value: formatCurrency(totals?.totalRevenue ?? 0),
        icon: TrendingUp
      },
      {
        title: 'New users',
        value: formatNumber(totals?.newUsers ?? 0),
        icon: Users
      },
      {
        title: 'Active properties',
        value: formatNumber(totals?.activeProperties ?? 0),
        icon: Building2
      },
      {
        title: 'Active subscriptions',
        value: formatNumber(totals?.activeSubscriptions ?? 0),
        icon: Layers
      }
    ],
    [totals]
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Reports & analytics</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Visualize platform performance, revenue, and engagement across the selected timeframe.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[3, 6, 12].map((value) => (
              <ActionButton
                key={value}
                variant={value === months ? 'primary' : 'outline'}
                label={`${value} months`}
                onClick={() => setMonths(value)}
              />
            ))}
            <ActionButton
              variant="secondary"
              label="Refresh"
              startIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => refetch()}
              disabled={isFetching}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <Loader className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <Users className="h-4 w-4 text-indigo-500" />
                  User growth
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{userGrowth.length} points</span>
              </div>
              <LineChart
                data={userGrowth.map((point) => point.count)}
                labels={userGrowth.map((point) => point.label)}
                label="User growth"
                color="rgba(79, 70, 229, 1)"
                gradientColor="rgba(79, 70, 229, 0.1)"
              />
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Revenue trend
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(
                  (revenueTrend as ReportsRevenuePoint[]).reduce((sum, point) => sum + point.amount, 0)
                )}</span>
              </div>
              <LineChart
                data={revenueTrend.map((point) => point.amount)}
                labels={revenueTrend.map((point) => point.label)}
                label="Revenue trend"
                color="rgba(16, 185, 129, 1)"
                gradientColor="rgba(16, 185, 129, 0.1)"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                Booking mix
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">By booking type</span>
            </div>
            <StackedBarChart
              labels={bookingTrend.map((item) => item.label)}
              datasets={[
                {
                  label: 'Shortlet',
                  data: bookingTrend.map((item) => item.shortlet),
                  backgroundColor: 'rgba(79, 70, 229, 0.7)'
                },
                {
                  label: 'Rental',
                  data: bookingTrend.map((item) => item.rental),
                  backgroundColor: 'rgba(16, 185, 129, 0.7)'
                },
                {
                  label: 'Sale inspection',
                  data: bookingTrend.map((item) => item.saleInspection),
                  backgroundColor: 'rgba(251, 191, 36, 0.7)'
                }
              ]}
            />
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Shortlet
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Rental
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Sale inspection
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <BreakdownList
              title="Booking status distribution"
              data={breakdowns?.bookingStatus ?? {}}
              palette={["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-blue-500"]}
            />
            <BreakdownList
              title="Property status"
              data={breakdowns?.propertyStatus ?? {}}
              palette={["bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-rose-500"]}
            />
            <BreakdownList
              title="Revenue by payment type"
              data={breakdowns?.revenueByType ?? {}}
              palette={["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]}
            />
          </section>

          {/* <section className="grid gap-4 lg:grid-cols-2">
            <BreakdownList
              title="Listings by offering"
              data={breakdowns?.propertyByListingType ?? {}}
              palette={["bg-indigo-500", "bg-emerald-500", "bg-amber-500"]}
            />
            <BreakdownList
              title="Subscription status"
              data={breakdowns?.subscriptionStatus ?? {}}
              palette={["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]}
            />
          </section> */}


        </>
      )}
    </div>
  );
};

export default ReportsPage;
