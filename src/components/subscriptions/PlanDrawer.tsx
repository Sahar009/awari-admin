import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Coins, Layers, Sparkles, X } from 'lucide-react';
import type { AdminSubscriptionPlan, AdminSubscriptionPlanPayload } from '../../services/types';
import { ActionButton } from '../ui/ActionButton';

interface PlanDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  plan?: AdminSubscriptionPlan | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (payload: AdminSubscriptionPlanPayload) => void;
  feedback?: { type: 'success' | 'error'; message: string } | null;
}

const defaultState: AdminSubscriptionPlanPayload & { featuresText: string } = {
  name: '',
  slug: '',
  planType: 'custom',
  description: '',
  monthlyPrice: 0,
  yearlyPrice: undefined,
  currency: 'NGN',
  maxProperties: undefined,
  maxPhotosPerProperty: undefined,
  featuredProperties: undefined,
  prioritySupport: false,
  analyticsAccess: false,
  supportLevel: '',
  trialPeriodDays: 0,
  isTrialEnabled: false,
  isRecommended: false,
  isActive: true,
  features: null,
  metadata: null,
  featuresText: ''
};

const supportLevels = [
  { value: '', label: 'Standard' },
  { value: 'priority', label: 'Priority' },
  { value: 'concierge', label: 'Concierge' }
];

const planTypes: Array<{ value: AdminSubscriptionPlanPayload['planType']; label: string }> = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'custom', label: 'Custom' },
  { value: 'other', label: 'Other' }
];

const PlanDrawer = ({ isOpen, mode, plan, isSaving, onClose, onSubmit, feedback }: PlanDrawerProps) => {
  const [formState, setFormState] = useState(defaultState);
  const [errors, setErrors] = useState<string | null>(null);

  const preparedFeatures = useMemo(() => {
    if (!formState.featuresText) return null;
    return formState.featuresText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [formState.featuresText]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && plan) {
        setFormState({
          name: plan.name,
          slug: plan.slug,
          planType: plan.planType,
          description: plan.description ?? '',
          monthlyPrice: Number(plan.monthlyPrice),
          yearlyPrice: plan.yearlyPrice ?? undefined,
          currency: plan.currency ?? 'NGN',
          maxProperties: plan.maxProperties ?? undefined,
          maxPhotosPerProperty: plan.maxPhotosPerProperty ?? undefined,
          featuredProperties: plan.featuredProperties ?? undefined,
          prioritySupport: plan.prioritySupport,
          analyticsAccess: plan.analyticsAccess,
          supportLevel: plan.supportLevel ?? '',
          trialPeriodDays: plan.trialPeriodDays ?? 0,
          isTrialEnabled: plan.isTrialEnabled ?? false,
          isRecommended: plan.isRecommended,
          isActive: plan.isActive,
          features: plan.features ?? null,
          metadata: plan.metadata ?? null,
          featuresText: (plan.features ?? []).join('\n')
        });
      } else {
        setFormState(defaultState);
      }
      setErrors(null);
    } else {
      setFormState(defaultState);
      setErrors(null);
    }
  }, [isOpen, mode, plan]);

  if (!isOpen) {
    return null;
  }

  const title = mode === 'create' ? 'Create subscription plan' : 'Update subscription plan';
  const subtitle =
    mode === 'create'
      ? 'Define the pricing, limits, and perks users will see when subscribing.'
      : `Adjust pricing, limits, and perks for ${plan?.name}.`;

  const handleInputChange =
    (field: keyof AdminSubscriptionPlanPayload | 'featuresText') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;

      if (field === 'prioritySupport' || field === 'analyticsAccess' || field === 'isTrialEnabled' || field === 'isRecommended' || field === 'isActive') {
        setFormState((prev) => ({
          ...prev,
          [field]: (event.target as HTMLInputElement).checked
        }));
        return;
      }

      if (
        field === 'monthlyPrice' ||
        field === 'yearlyPrice' ||
        field === 'maxProperties' ||
        field === 'maxPhotosPerProperty' ||
        field === 'featuredProperties' ||
        field === 'trialPeriodDays'
      ) {
        setFormState((prev) => ({
          ...prev,
          [field]: value === '' ? undefined : Number(value)
        }));
        return;
      }

      setFormState((prev) => ({
        ...prev,
        [field]: value
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);

    if (!formState.name.trim()) {
      setErrors('Plan name is required.');
      return;
    }

    if (!formState.monthlyPrice || Number(formState.monthlyPrice) <= 0) {
      setErrors('Monthly price must be greater than zero.');
      return;
    }

    const payload: AdminSubscriptionPlanPayload = {
      name: formState.name.trim(),
      slug: formState.slug?.trim() || undefined,
      planType: formState.planType,
      description: formState.description?.trim() || undefined,
      monthlyPrice: Number(formState.monthlyPrice),
      yearlyPrice:
        formState.yearlyPrice === undefined || formState.yearlyPrice === null
          ? undefined
          : Number(formState.yearlyPrice),
      currency: formState.currency?.toUpperCase() || 'NGN',
      maxProperties: formState.maxProperties ?? undefined,
      maxPhotosPerProperty: formState.maxPhotosPerProperty ?? undefined,
      featuredProperties: formState.featuredProperties ?? undefined,
      prioritySupport: Boolean(formState.prioritySupport),
      analyticsAccess: Boolean(formState.analyticsAccess),
      supportLevel: formState.supportLevel || undefined,
      trialPeriodDays: formState.trialPeriodDays ?? 0,
      isTrialEnabled: Boolean(formState.isTrialEnabled),
      isRecommended: Boolean(formState.isRecommended),
      isActive: Boolean(formState.isActive),
      features: preparedFeatures,
      metadata: formState.metadata ?? undefined
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {mode === 'create' ? 'New plan' : 'Edit plan'}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close plan drawer"
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

          <section className="grid gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 md:grid-cols-[1.5fr,1fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Layers className="h-4 w-4 text-indigo-500" />
                Plan overview
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</label>
                  <input
                    value={formState.name}
                    onChange={handleInputChange('name')}
                    placeholder="Premium Partner"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Slug (optional)</label>
                  <input
                    value={formState.slug ?? ''}
                    onChange={handleInputChange('slug')}
                    placeholder="premium-partner"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan type</label>
                  <select
                    value={formState.planType ?? 'custom'}
                    onChange={handleInputChange('planType')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  >
                    {planTypes.map((type) => (
                      <option key={type.value} value={type.value ?? 'custom'}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</label>
                  <textarea
                    value={formState.description ?? ''}
                    onChange={handleInputChange('description')}
                    rows={3}
                    placeholder="Highlight who this plan is for and what makes it stand out."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Coins className="h-4 w-4 text-indigo-500" />
                Billing snapshot
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Preview how the plan appears to customers. Adjust currency and pricing below.
              </div>
              <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/70">
                <div className="font-semibold text-slate-900 dark:text-white">
                  ₦{Number(formState.monthlyPrice || 0).toLocaleString()}{' '}
                  <span className="text-xs font-normal">/ month</span>
                </div>
                {formState.yearlyPrice ? (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ₦{Number(formState.yearlyPrice).toLocaleString()} billed yearly
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Yearly price will default to 12 × monthly price.
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(formState.isRecommended)}
                  onChange={handleInputChange('isRecommended')}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-500 dark:text-slate-300">Highlight this plan as “Recommended”</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(formState.isActive)}
                  onChange={handleInputChange('isActive')}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-500 dark:text-slate-300">Plan is visible to users</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <BadgeCheck className="h-4 w-4 text-indigo-500" />
                Pricing & limits
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly price (₦)</label>
                <input
                  type="number"
                  min={0}
                  value={formState.monthlyPrice ?? ''}
                  onChange={handleInputChange('monthlyPrice')}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Yearly price (₦)</label>
                <input
                  type="number"
                  min={0}
                  value={formState.yearlyPrice ?? ''}
                  onChange={handleInputChange('yearlyPrice')}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Currency</label>
                <input
                  value={formState.currency ?? 'NGN'}
                  onChange={handleInputChange('currency')}
                  maxLength={3}
                  className="mt-1 uppercase w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mt-6">
                  <input
                    type="checkbox"
                    checked={Boolean(formState.isTrialEnabled)}
                    onChange={handleInputChange('isTrialEnabled')}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  Trial Enabled
                </label>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Trial period (days)</label>
                <input
                  type="number"
                  min={0}
                  value={formState.trialPeriodDays ?? 0}
                  onChange={handleInputChange('trialPeriodDays')}
                  disabled={!formState.isTrialEnabled}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Max properties</label>
                <input
                  type="number"
                  value={formState.maxProperties ?? ''}
                  onChange={handleInputChange('maxProperties')}
                  placeholder="e.g. 20 or -1 for unlimited"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Max photos per property</label>
                <input
                  type="number"
                  value={formState.maxPhotosPerProperty ?? ''}
                  onChange={handleInputChange('maxPhotosPerProperty')}
                  placeholder="e.g. 25"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured properties</label>
                <input
                  type="number"
                  value={formState.featuredProperties ?? ''}
                  onChange={handleInputChange('featuredProperties')}
                  placeholder="e.g. 3 or -1 for unlimited"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <input
                  type="checkbox"
                  checked={Boolean(formState.prioritySupport)}
                  onChange={handleInputChange('prioritySupport')}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                Priority support
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <input
                  type="checkbox"
                  checked={Boolean(formState.analyticsAccess)}
                  onChange={handleInputChange('analyticsAccess')}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                Analytics access
              </label>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Support level</label>
                <select
                  value={formState.supportLevel ?? ''}
                  onChange={handleInputChange('supportLevel')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                >
                  {supportLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Plan features
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Outline the top benefits or tools included in this plan. Add one feature per line.
            </p>
            <textarea
              value={formState.featuresText}
              onChange={handleInputChange('featuresText')}
              rows={6}
              placeholder={'Unlimited listings\nPriority support queue\nAdvanced analytics reports'}
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            />
            {preparedFeatures?.length ? (
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                <p className="font-semibold text-slate-600 dark:text-slate-200">Preview</p>
                <ul className="mt-2 space-y-1">
                  {preparedFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {errors ? (
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200">
              {errors}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <ActionButton variant="outline" label="Cancel" onClick={onClose} disabled={isSaving} />
            <ActionButton
              variant="primary"
              label={isSaving ? 'Saving...' : mode === 'create' ? 'Create plan' : 'Update plan'}
              type="submit"
              disabled={isSaving}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanDrawer;

