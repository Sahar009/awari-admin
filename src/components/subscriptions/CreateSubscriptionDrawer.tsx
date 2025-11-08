import { useEffect, useMemo, useState } from 'react';
import { Sparkles, UserPlus, Layers, BadgeCheck, Info } from 'lucide-react';
import type { AdminSubscriptionCreatePayload, AdminSubscriptionPlan } from '../../services/types';
import { ActionButton } from '../ui/ActionButton';
import { X } from 'lucide-react';

interface CreateSubscriptionDrawerProps {
  isOpen: boolean;
  isCreating?: boolean;
  feedback?: { type: 'success' | 'error'; message: string } | null;
  plans?: AdminSubscriptionPlan[];
  onClose: () => void;
  onCreate: (payload: AdminSubscriptionCreatePayload) => void;
}

const initialState: AdminSubscriptionCreatePayload & { planId?: string; planSlug?: string } = {
  userId: '',
  planId: undefined,
  planSlug: undefined,
  planType: 'basic',
  billingCycle: 'monthly',
  autoRenew: true,
  customPlan: null
};

const CreateSubscriptionDrawer = ({
  isOpen,
  isCreating,
  feedback,
  plans = [],
  onClose,
  onCreate
}: CreateSubscriptionDrawerProps) => {
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState<string | null>(null);

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);
  const selectedPlan = useMemo(() => activePlans.find((plan) => plan.id === formState.planId), [activePlans, formState.planId]);
  const isCustomPlan = !selectedPlan && (formState.planType === 'custom' || formState.planType === 'other');

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialState);
      setErrors(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handlePlanSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'custom') {
      setFormState((prev) => ({
        ...prev,
        planId: undefined,
        planSlug: undefined,
        planType: 'custom',
        customPlan: {
          planName: '',
          monthlyPrice: 0,
          yearlyPrice: undefined,
          maxProperties: 1,
          maxPhotosPerProperty: 10,
          featuredProperties: 0,
          prioritySupport: false,
          analyticsAccess: false
        }
      }));
      return;
    }

    const plan = activePlans.find((item) => item.id === value);
    if (plan) {
      setFormState((prev) => ({
        ...prev,
        planId: plan.id,
        planSlug: plan.slug,
        planType: plan.planType ?? 'other',
        customPlan: null,
        billingCycle: prev.billingCycle ?? 'monthly'
      }));
    }
  };

  const handleChange = (field: keyof AdminSubscriptionCreatePayload) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (field === 'autoRenew') {
      setFormState((prev) => ({ ...prev, autoRenew: (event.target as HTMLInputElement).checked }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value as any }));
    }
  };

  const handleCustomPlanChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({
      ...prev,
      customPlan: {
        ...(prev.customPlan ?? {}),
        [field]: field.toLowerCase().includes('price') || field === 'maxProperties' ? Number(value) : value
      }
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);

    if (!formState.userId) {
      setErrors('User ID is required.');
      return;
    }

    if (!selectedPlan && !isCustomPlan) {
      setErrors('Select a subscription plan before assigning.');
      return;
    }

    if (isCustomPlan) {
      if (!formState.customPlan?.planName) {
        setErrors('Custom plan requires a plan name.');
        return;
      }
      if (!formState.customPlan?.monthlyPrice) {
        setErrors('Custom plan requires a monthly price.');
        return;
      }
      if (!formState.customPlan?.maxProperties) {
        setErrors('Custom plan requires a max properties value.');
        return;
      }
    }

    onCreate({
      ...formState,
      planId: selectedPlan?.id,
      planSlug: selectedPlan?.slug,
      planType: selectedPlan?.planType ?? formState.planType,
      userId: formState.userId.trim(),
      customPlan: isCustomPlan ? formState.customPlan : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto border-l border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Assign subscription</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Assign a plan to this user</h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Pick an active subscription plan or design a one-off custom plan for this user.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close subscription drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          {feedback ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200'
                  : 'border-rose-400/40 bg-rose-500/10 text-rose-600 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-200'
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Subscriber</h3>
            </div>
            <div className="mt-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">User ID</label>
              <input
                value={formState.userId}
                onChange={handleChange('userId')}
                placeholder="User UUID"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plan selection</h3>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Available plans</label>
              <select
                value={selectedPlan?.id ?? (isCustomPlan ? 'custom' : '')}
                onChange={handlePlanSelect}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
              >
                <option value="">Select a plan…</option>
                {activePlans.map((planOption) => (
                  <option key={planOption.id} value={planOption.id}>
                    {planOption.name} • ₦{Number(planOption.monthlyPrice).toLocaleString()} / month
                  </option>
                ))}
                <option value="custom">Create custom plan</option>
              </select>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Info className="h-3.5 w-3.5 text-indigo-500" />
                Only active plans appear here. Manage plans from the Plans page.
              </p>
            </div>
            {selectedPlan ? (
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedPlan.name}</div>
                  <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                    {selectedPlan.planType}
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  ₦{Number(selectedPlan.monthlyPrice).toLocaleString()} monthly • ₦
                  {Number(selectedPlan.yearlyPrice ?? selectedPlan.monthlyPrice * 12).toLocaleString()} yearly
                </div>
                {selectedPlan.features?.length ? (
                  <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-300">
                    {selectedPlan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Billing preferences</h3>
            </div>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billing cycle</label>
                <select
                  value={formState.billingCycle}
                  onChange={handleChange('billingCycle')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <input
                  type="checkbox"
                  checked={Boolean(formState.autoRenew)}
                  onChange={handleChange('autoRenew')}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                Auto-renew enabled
              </label>
            </div>
          </section>

          {isCustomPlan ? (
            <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Custom plan details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan name</label>
                  <input
                    value={(formState.customPlan as any)?.planName ?? ''}
                    onChange={handleCustomPlanChange('planName')}
                    placeholder="Enterprise Concierge"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={(formState.customPlan as any)?.monthlyPrice ?? ''}
                    onChange={handleCustomPlanChange('monthlyPrice')}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Yearly price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={(formState.customPlan as any)?.yearlyPrice ?? ''}
                    onChange={handleCustomPlanChange('yearlyPrice')}
                    placeholder="Optional"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Max properties</label>
                  <input
                    type="number"
                    min={1}
                    value={(formState.customPlan as any)?.maxProperties ?? ''}
                    onChange={handleCustomPlanChange('maxProperties')}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            </section>
          ) : null}

          {errors ? (
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200">
              {errors}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <ActionButton variant="outline" label="Cancel" onClick={onClose} disabled={isCreating} />
            <ActionButton
              variant="primary"
              label={isCreating ? 'Assigning...' : 'Assign subscription'}
              type="submit"
              disabled={isCreating}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionDrawer;


