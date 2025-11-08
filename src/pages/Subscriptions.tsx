import { useMemo, useState } from 'react';
import { Crown, Eye, Filter, Loader, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  useSubscriptions,
  useSubscriptionDetail,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useRenewSubscriptionMutation
} from '../hooks/useSubscriptions';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import { ActionButton } from '../components/ui/ActionButton';
import SubscriptionDrawer from '../components/subscriptions/SubscriptionDrawer';
import CreateSubscriptionDrawer from '../components/subscriptions/CreateSubscriptionDrawer';
import type {
  AdminSubscriptionCancelPayload,
  AdminSubscriptionCreatePayload,
  AdminSubscriptionRenewPayload,
  AdminSubscriptionUpdatePayload
} from '../services/types';

const formatCurrency = (value?: number, currency = 'NGN') => {
  if (value === undefined || value === null) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const StatCard = ({
  title,
  value,
  description
}: {
  title: string;
  value: string;
  description?: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {description ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  </div>
);

const SubscriptionsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('active');
  const [planType, setPlanType] = useState<string>('all');
  const [billingCycle, setBillingCycle] = useState<string>('all');
  const [autoRenew, setAutoRenew] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerFeedback, setDrawerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [createFeedback, setCreateFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const { data, isLoading, isFetching, refetch } = useSubscriptions({
    page,
    status: status === 'all' ? undefined : status,
    planType: planType === 'all' ? undefined : planType,
    billingCycle: billingCycle === 'all' ? undefined : billingCycle,
    autoRenew: autoRenew === 'all' ? undefined : autoRenew === 'enabled',
    search: search.trim() || undefined
  });

  const { data: planList } = useSubscriptionPlans({ status: 'active', limit: 100, includeInactive: false });
  const availablePlans = planList?.plans ?? [];

  const summary = data?.summary;
  const pagination = data?.pagination;
  const subscriptions = data?.subscriptions ?? [];

  const { data: subscriptionDetail } = useSubscriptionDetail(
    selectedSubscriptionId ?? undefined,
    isDrawerOpen
  );
  const createSubscriptionMutation = useCreateSubscriptionMutation();
  const updateSubscriptionMutation = useUpdateSubscriptionMutation();
  const cancelSubscriptionMutation = useCancelSubscriptionMutation();
  const renewSubscriptionMutation = useRenewSubscriptionMutation();

  const planBreakdown = useMemo<Record<string, number>>(
    () => summary?.breakdown.byPlanType ?? {},
    [summary]
  );
  const billingBreakdown = useMemo<Record<string, number>>(
    () => summary?.breakdown.byBillingCycle ?? {},
    [summary]
  );
  const autoRenewBreakdown: { enabled: number; disabled: number } =
    summary?.breakdown.autoRenew ?? { enabled: 0, disabled: 0 };

  const handleOpenDrawer = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setDrawerFeedback(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedSubscriptionId(null);
      setDrawerFeedback(null);
    }, 300);
  };

  const handleUpdateSubscription = (payload: AdminSubscriptionUpdatePayload) => {
    if (!selectedSubscriptionId) return;
    setDrawerFeedback(null);
    updateSubscriptionMutation.mutate(
      { subscriptionId: selectedSubscriptionId, payload },
      {
        onSuccess: (response) => {
          setDrawerFeedback({
            type: 'success',
            message: response?.message ?? 'Subscription updated successfully'
          });
        },
        onError: (error) => {
          setDrawerFeedback({
            type: 'error',
            message: getErrorMessage(error, 'Failed to update subscription')
          });
        }
      }
    );
  };

  const handleCancelSubscription = (payload: AdminSubscriptionCancelPayload) => {
    if (!selectedSubscriptionId) return;
    setDrawerFeedback(null);
    cancelSubscriptionMutation.mutate(
      { subscriptionId: selectedSubscriptionId, payload },
      {
        onSuccess: (response) => {
          setDrawerFeedback({
            type: 'success',
            message: response?.message ?? 'Subscription cancelled successfully'
          });
        },
        onError: (error) => {
          setDrawerFeedback({
            type: 'error',
            message: getErrorMessage(error, 'Failed to cancel subscription')
          });
        }
      }
    );
  };

  const handleRenewSubscription = (payload: AdminSubscriptionRenewPayload) => {
    if (!selectedSubscriptionId) return;
    setDrawerFeedback(null);
    renewSubscriptionMutation.mutate(
      { subscriptionId: selectedSubscriptionId, payload },
      {
        onSuccess: (response) => {
          setDrawerFeedback({
            type: 'success',
            message: response?.message ?? 'Subscription renewed successfully'
          });
        },
        onError: (error) => {
          setDrawerFeedback({
            type: 'error',
            message: getErrorMessage(error, 'Failed to renew subscription')
          });
        }
      }
    );
  };

  const handleCreateSubscription = (payload: AdminSubscriptionCreatePayload) => {
    setCreateFeedback(null);
    createSubscriptionMutation.mutate(payload, {
      onSuccess: (response) => {
        setCreateFeedback({
          type: 'success',
          message: response?.message ?? 'Subscription created successfully'
        });
        setTimeout(() => {
          setCreateDrawerOpen(false);
          setCreateFeedback(null);
        }, 800);
      },
      onError: (error) => {
        setCreateFeedback({
          type: 'error',
          message: getErrorMessage(error, 'Failed to create subscription')
        });
      }
    });
  };

  const handleOpenCreateDrawer = () => {
    setCreateFeedback(null);
    setCreateDrawerOpen(true);
  };

  const handleCloseCreateDrawer = () => {
    setCreateDrawerOpen(false);
    setCreateFeedback(null);
  };

  const resetFilters = () => {
    setPage(1);
    setStatus('active');
    setPlanType('all');
    setBillingCycle('all');
    setAutoRenew('all');
    setSearch('');
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Subscriptions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monitor plan adoption, recurring revenue, and auto-renewal behavior across the platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ActionButton
              variant="secondary"
              label="Refresh"
              startIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => refetch()}
            />
            <ActionButton
              variant="primary"
              label="Assign subscription"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={handleOpenCreateDrawer}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading subscription data...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Active subscriptions"
                value={(summary?.totals.active ?? 0).toLocaleString()}
                description={`Total: ${(summary?.totals.totalSubscriptions ?? 0).toLocaleString()}`}
              />
              <StatCard
                title="MRR (Monthly Recurring Revenue)"
                value={formatCurrency(summary?.revenue.monthlyRecurringRevenue)}
                description="Estimated monthly recurring revenue"
              />
              <StatCard
                title="Subscription revenue"
                value={formatCurrency(summary?.revenue.totalRevenue)}
                description="Total completed subscription payments"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plan type breakdown</h3>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(planBreakdown).length ? (
                    Object.entries(planBreakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                        <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p>No plan data available.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Billing cycle & auto-renew</h3>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(billingBreakdown).length ? (
                    Object.entries(billingBreakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                        <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p>No billing cycle data available.</p>
                  )}
                  <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                    <span className="text-slate-600 dark:text-slate-300">Auto-renew enabled</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {autoRenewBreakdown.enabled.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                    <span className="text-slate-600 dark:text-slate-300">Auto-renew disabled</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {autoRenewBreakdown.disabled.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Filter className="h-4 w-4 text-slate-400" />
            <span>Filters</span>
          </div>
          {isFetching && !isLoading ? (
            <div className="flex items-center gap-2 text-xs text-indigo-500">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              Refreshing subscriptions...
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</label>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan type</label>
            <select
              value={planType}
              onChange={(event) => {
                setPlanType(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billing cycle</label>
            <select
              value={billingCycle}
              onChange={(event) => {
                setBillingCycle(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All cycles</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Auto-renew</label>
            <select
              value={autoRenew}
              onChange={(event) => {
                setAutoRenew(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All subscriptions</option>
              <option value="enabled">Auto-renew enabled</option>
              <option value="disabled">Auto-renew disabled</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr,auto]">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Search</label>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Plan name, plan type, user email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="flex items-end">
            <ActionButton variant="outline" label="Reset filters" onClick={resetFilters} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Subscriber</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Pricing</th>
                <th className="px-4 py-3 text-left font-semibold">Billing</th>
                <th className="px-4 py-3 text-left font-semibold">Auto-renew</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : subscriptions.length ? (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{subscription.planName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {subscription.planType} • Max properties {subscription.maxProperties}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {subscription.user
                          ? `${subscription.user.firstName} ${subscription.user.lastName}`
                          : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{subscription.user?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {subscription.status}
                      {subscription.cancellationReason ? (
                        <div className="mt-1 text-[11px] text-rose-500 dark:text-rose-300">
                          {subscription.cancellationReason}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(
                        subscription.billingCycle === 'yearly'
                          ? subscription.yearlyPrice ?? subscription.monthlyPrice
                          : subscription.monthlyPrice,
                        subscription.currency
                      )}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        / {subscription.billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      Started {formatDate(subscription.startDate)}
                      <br />
                      Next billing {formatDate(subscription.nextBillingDate)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                        {subscription.autoRenew ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Auto-renew on
                          </>
                        ) : (
                          <>
                            <Crown className="h-3.5 w-3.5" />
                            Manual renewal
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <ActionButton
                        variant="outline"
                        label="View"
                        startIcon={<Eye className="h-4 w-4" />}
                        onClick={() => handleOpenDrawer(subscription.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No subscriptions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-3">
              <ActionButton
                variant="outline"
                label="Previous"
                onClick={() => pagination.hasPrevPage && setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage || isFetching}
              />
              <ActionButton
                variant="outline"
                label="Next"
                onClick={() => pagination.hasNextPage && setPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage || isFetching}
              />
            </div>
          </div>
        ) : null}
      </section>
      <SubscriptionDrawer
        isOpen={isDrawerOpen}
        subscription={subscriptionDetail}
        isUpdating={updateSubscriptionMutation.isPending}
        isCancelling={cancelSubscriptionMutation.isPending}
        isRenewing={renewSubscriptionMutation.isPending}
        onClose={handleCloseDrawer}
        onUpdate={handleUpdateSubscription}
        onCancel={handleCancelSubscription}
        onRenew={handleRenewSubscription}
        feedback={drawerFeedback}
      />
      <CreateSubscriptionDrawer
        isOpen={createDrawerOpen}
        isCreating={createSubscriptionMutation.isPending}
        feedback={createFeedback}
        plans={availablePlans}
        onClose={handleCloseCreateDrawer}
        onCreate={handleCreateSubscription}
      />
    </div>
  );
};

export default SubscriptionsPage;


