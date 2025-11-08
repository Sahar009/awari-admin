import { useMemo, useState } from 'react';
import { Layers, Filter, Loader, RefreshCw, Plus, Pencil, Power } from 'lucide-react';
import {
  useSubscriptionPlans,
  useSubscriptionPlanDetail,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useToggleSubscriptionPlanStatusMutation
} from '../hooks/useSubscriptionPlans';
import { ActionButton } from '../components/ui/ActionButton';
import PlanDrawer from '../components/subscriptions/PlanDrawer';
import type { AdminSubscriptionPlanPayload } from '../services/types';

const PlansPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [planType, setPlanType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [drawerFeedback, setDrawerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data, isLoading, isFetching, refetch } = useSubscriptionPlans({
    page,
    status: status === 'all' ? undefined : status,
    planType: planType === 'all' ? undefined : planType,
    search: search.trim() || undefined,
    includeInactive: status === 'all' || status === 'inactive'
  });

  const plans = data?.plans ?? [];
  const pagination = data?.pagination;
  const summary = data?.stats;

  const { data: planDetail } = useSubscriptionPlanDetail(
    selectedPlanId ?? undefined,
    drawerOpen && drawerMode === 'edit'
  );

  const createPlanMutation = useCreateSubscriptionPlanMutation();
  const updatePlanMutation = useUpdateSubscriptionPlanMutation();
  const togglePlanStatusMutation = useToggleSubscriptionPlanStatusMutation();

  const handleOpenCreatePlan = () => {
    setDrawerMode('create');
    setSelectedPlanId(null);
    setDrawerFeedback(null);
    setDrawerOpen(true);
  };

  const handleOpenEditPlan = (planId: string) => {
    setDrawerMode('edit');
    setSelectedPlanId(planId);
    setDrawerFeedback(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerFeedback(null);
  };

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const handleCreatePlan = (payload: AdminSubscriptionPlanPayload) => {
    setDrawerFeedback(null);
    createPlanMutation.mutate(payload, {
      onSuccess: (response) => {
        setDrawerFeedback({
          type: 'success',
          message: response?.message ?? 'Subscription plan created successfully'
        });
        refetch();
        setTimeout(() => {
          handleCloseDrawer();
        }, 600);
      },
      onError: (error) => {
        setDrawerFeedback({
          type: 'error',
          message: getErrorMessage(error, 'Failed to create subscription plan')
        });
      }
    });
  };

  const handleUpdatePlan = (payload: AdminSubscriptionPlanPayload) => {
    if (!selectedPlanId) return;
    setDrawerFeedback(null);
    updatePlanMutation.mutate(
      { planId: selectedPlanId, payload },
      {
        onSuccess: (response) => {
          setDrawerFeedback({
            type: 'success',
            message: response?.message ?? 'Subscription plan updated successfully'
          });
          refetch();
          setTimeout(() => {
            handleCloseDrawer();
          }, 600);
        },
        onError: (error) => {
          setDrawerFeedback({
            type: 'error',
            message: getErrorMessage(error, 'Failed to update subscription plan')
          });
        }
      }
    );
  };

  const handleTogglePlanStatus = (planId: string, shouldActivate: boolean) => {
    togglePlanStatusMutation.mutate(
      { planId, payload: { isActive: shouldActivate } },
      {
        onSuccess: () => refetch()
      }
    );
  };

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Subscription plans</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Publish, refine, and maintain the pricing tiers available to your customers.
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
              label="New plan"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={handleOpenCreatePlan}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading subscription plans...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total plans</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                {summary?.totalPlans ?? plans.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active plans</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                {activePlans.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active subscriptions</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                {summary?.totalActiveSubscriptions ?? 0}
              </p>
            </div>
          </div>
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
              Refreshing plans...
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</label>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as typeof status);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All plans</option>
              <option value="active">Active</option>
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
              <option value="all">All types</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="custom">Custom</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Search</label>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Plan name or slug"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Pricing</th>
                <th className="px-4 py-3 text-left font-semibold">Limits & perks</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : plans.length ? (
                plans.map((plan) => (
                  <tr key={plan.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{plan.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{plan.description ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      ₦{Number(plan.monthlyPrice).toLocaleString()} / month
                      <br />
                      ₦{Number(plan.yearlyPrice ?? plan.monthlyPrice * 12).toLocaleString()} / year
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      Max properties: {plan.maxProperties ?? '—'}
                      <br />
                      Featured slots: {plan.featuredProperties ?? '—'}
                      <br />
                      Support: {plan.supportLevel || (plan.prioritySupport ? 'priority' : 'standard')}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          plan.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-200'
                            : 'bg-slate-500/10 text-slate-500 dark:bg-slate-500/15 dark:text-slate-300'
                        }`}
                      >
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <ActionButton
                          variant="outline"
                          label="Edit"
                          startIcon={<Pencil className="h-4 w-4" />}
                          onClick={() => handleOpenEditPlan(plan.id)}
                        />
                        <ActionButton
                          variant="outline"
                          label={plan.isActive ? 'Deactivate' : 'Activate'}
                          startIcon={<Power className="h-4 w-4" />}
                          onClick={() => handleTogglePlanStatus(plan.id, !plan.isActive)}
                          disabled={togglePlanStatusMutation.isPending}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No subscription plans match the current filters.
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

      <PlanDrawer
        isOpen={drawerOpen}
        mode={drawerMode}
        plan={drawerMode === 'edit' ? planDetail ?? null : null}
        isSaving={createPlanMutation.isPending || updatePlanMutation.isPending}
        onClose={handleCloseDrawer}
        onSubmit={(payload) => {
          if (drawerMode === 'create') {
            handleCreatePlan(payload);
          } else {
            handleUpdatePlan(payload);
          }
        }}
        feedback={drawerFeedback}
      />
    </div>
  );
};

export default PlansPage;
