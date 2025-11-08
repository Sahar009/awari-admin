import { useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, Sparkles, User2, Wallet, X } from 'lucide-react';
import type {
  AdminSubscriptionDetail,
  AdminSubscriptionUpdatePayload,
  AdminSubscriptionCancelPayload,
  AdminSubscriptionRenewPayload
} from '../../services/types';
import { ActionButton } from '../ui/ActionButton';

interface SubscriptionDrawerProps {
  isOpen: boolean;
  subscription?: AdminSubscriptionDetail;
  isUpdating?: boolean;
  isCancelling?: boolean;
  isRenewing?: boolean;
  onClose: () => void;
  onUpdate: (payload: AdminSubscriptionUpdatePayload) => void;
  onCancel: (payload: AdminSubscriptionCancelPayload) => void;
  onRenew: (payload: AdminSubscriptionRenewPayload) => void;
  feedback?: { type: 'success' | 'error'; message: string } | null;
}

const statusOptions = ['active', 'pending', 'cancelled', 'expired', 'inactive'] as const;
const billingOptions = ['monthly', 'yearly', 'custom'] as const;

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

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const SubscriptionDrawer = ({
  isOpen,
  subscription,
  isUpdating,
  isCancelling,
  isRenewing,
  onClose,
  onUpdate,
  onCancel,
  onRenew,
  feedback
}: SubscriptionDrawerProps) => {
  const [formState, setFormState] = useState<AdminSubscriptionUpdatePayload>({
    status: subscription?.status,
    autoRenew: subscription?.autoRenew,
    billingCycle: subscription?.billingCycle,
    nextBillingDate: subscription?.nextBillingDate ?? undefined
  });
  const [cancelReason, setCancelReason] = useState('');
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (subscription && isOpen) {
      setFormState({
        status: subscription.status,
        autoRenew: subscription.autoRenew,
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate ?? undefined
      });
      setCancelReason('');
      setErrors(null);
    } else if (!isOpen) {
      setFormState({});
      setCancelReason('');
      setErrors(null);
    }
  }, [subscription, isOpen]);

  const planFeatures = useMemo(() => {
    if (!subscription?.features) return [];
    if (Array.isArray(subscription.features)) return subscription.features;
    return Object.entries(subscription.features).map(([key, value]) => `${key}: ${String(value)}`);
  }, [subscription]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof AdminSubscriptionUpdatePayload) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (field === 'autoRenew') {
      setFormState((prev) => ({ ...prev, [field]: (event.target as HTMLInputElement).checked }));
    } else if (field === 'nextBillingDate') {
      setFormState((prev) => ({ ...prev, [field]: value ? new Date(value).toISOString() : null }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value as any }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);
    if (!subscription) return;
    onUpdate(formState);
  };

  const handleCancel = () => {
    if (!subscription) return;
    onCancel({ cancellationReason: cancelReason || undefined });
  };

  const handleRenew = () => {
    if (!subscription) return;
    onRenew({ billingCycle: formState.billingCycle });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Subscription detail</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {subscription?.planName ?? 'Subscription'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                {subscription?.planType}
              </span>
              <span>Started {formatDate(subscription?.startDate)}</span>
              {subscription?.endDate ? <span>Ends {formatDate(subscription.endDate)}</span> : null}
            </div>
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

        <div className="space-y-6 px-6 py-6">
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
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Plan overview</div>
              <div className="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Billing cycle</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{subscription?.billingCycle}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Monthly price</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(subscription?.monthlyPrice, subscription?.currency)}
                  </span>
                </div>
                {subscription?.yearlyPrice ? (
                  <div className="mt-2 flex items-center justify-between">
                    <span>Yearly price</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(subscription.yearlyPrice, subscription.currency)}
                    </span>
                  </div>
                ) : null}
                <div className="mt-3 rounded-xl bg-indigo-500/10 px-3 py-2 text-xs text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                  <strong>Limits:</strong> {subscription?.maxProperties} properties •{' '}
                  {subscription?.maxPhotosPerProperty} photos per listing •{' '}
                  {subscription?.featuredProperties} featured slots
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-indigo-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {subscription?.user ? `${subscription.user.firstName} ${subscription.user.lastName}` : '—'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{subscription?.user?.email ?? '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Role: {subscription?.user?.role ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-renew: {subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {subscription?.cancellationReason ? (
                <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:bg-rose-500/15 dark:text-rose-200">
                  Cancelled: {subscription.cancellationReason}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plan benefits</h3>
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {planFeatures.length ? (
                planFeatures.map((feature) => (
                  <div key={feature} className="rounded-xl bg-slate-50/80 px-3 py-2 dark:bg-slate-900/60">
                    {feature}
                  </div>
                ))
              ) : (
                <p>This plan does not include any additional feature metadata.</p>
              )}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Manage subscription</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</label>
                <select
                  value={formState.status ?? subscription?.status ?? 'active'}
                  onChange={handleChange('status')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <input
                    type="checkbox"
                    checked={Boolean(formState.autoRenew ?? subscription?.autoRenew)}
                    onChange={handleChange('autoRenew')}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  Auto-renew
                </label>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billing cycle</label>
                  <select
                    value={formState.billingCycle ?? subscription?.billingCycle ?? 'monthly'}
                    onChange={handleChange('billingCycle')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  >
                    {billingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next billing date</label>
              <input
                type="date"
                value={
                  formState.nextBillingDate
                    ? new Date(formState.nextBillingDate).toISOString().split('T')[0]
                    : subscription?.nextBillingDate
                    ? new Date(subscription.nextBillingDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange('nextBillingDate')}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
              />
            </div>

            {errors ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200">
                {errors}
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3">
              <ActionButton variant="outline" label="Close" onClick={onClose} disabled={isUpdating || isCancelling || isRenewing} />
              <ActionButton
                variant="primary"
                label={isUpdating ? 'Saving...' : 'Save changes'}
                type="submit"
                disabled={isUpdating}
              />
            </div>
          </form>

          <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cancel subscription</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cancelling will immediately set the subscription status to cancelled and disable auto-renewal.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Optional cancellation reason"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-rose-500 dark:focus:ring-rose-500/40"
            />
            <ActionButton
              variant="outline"
              label={isCancelling ? 'Cancelling...' : 'Cancel subscription'}
              onClick={handleCancel}
              disabled={isCancelling}
            />
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Renew subscription</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Renewing will reactivate expired or cancelled subscriptions and reset billing dates.
            </p>
            <ActionButton
              variant="secondary"
              label={isRenewing ? 'Renewing...' : 'Renew now'}
              onClick={handleRenew}
              disabled={isRenewing}
            />
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent payments</h3>
            </div>
            <div className="mt-3 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {subscription?.payments?.length ? (
                subscription.payments.map((payment) => (
                  <div key={payment.id} className="rounded-xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{payment.status}</span>
                    </div>
                    <div className="mt-1 text-slate-500 dark:text-slate-400">
                      {payment.description || `Payment #${payment.id.slice(0, 8)}`}
                    </div>
                    <div className="mt-1 text-slate-500 dark:text-slate-400">
                      {formatDateTime(payment.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent payments recorded for this subscription.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDrawer;
