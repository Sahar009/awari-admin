import { useMemo, useState } from 'react';
import { Banknote, CreditCard, Filter, Loader, RefreshCw } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import type { AdminTransaction } from '../services/types';
import { ActionButton } from '../components/ui/ActionButton';

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

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  tone = 'default'
}: {
  title: string;
  value: string;
  icon: typeof CreditCard;
  tone?: 'default' | 'positive' | 'warning';
}) => {
  const toneClass =
    tone === 'positive'
      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200'
      : tone === 'warning'
      ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200'
      : 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

const TransactionsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('completed');
  const [paymentType, setPaymentType] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<string>('all');
  const [gateway, setGateway] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, isFetching, refetch } = useTransactions({
    page,
    status: status === 'all' ? undefined : status,
    paymentType: paymentType === 'all' ? undefined : paymentType,
    paymentMethod: paymentMethod === 'all' ? undefined : paymentMethod,
    gateway: gateway === 'all' ? undefined : gateway,
    search: search.trim() || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined
  });

  const pagination = data?.pagination;
  const summary = data?.summary;
  const transactions: AdminTransaction[] = data?.transactions ?? [];

  const statusBreakdown = useMemo<Record<string, number>>(
    () => summary?.statusBreakdown ?? {},
    [summary]
  );
  const typeBreakdown = useMemo<Record<string, number>>(
    () => summary?.typeBreakdown ?? {},
    [summary]
  );

  const resetFilters = () => {
    setPage(1);
    setStatus('completed');
    setPaymentType('all');
    setPaymentMethod('all');
    setGateway('all');
    setSearch('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track booking payments, subscription charges, refunds, and payouts across the platform.
            </p>
          </div>
          <ActionButton
            variant="secondary"
            label="Refresh"
            startIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => refetch()}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading transactions...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total volume"
                value={formatCurrency(summary?.totalAmount)}
                icon={Banknote}
                tone="default"
              />
              <StatCard
                title="Completed revenue"
                value={formatCurrency(summary?.completedAmount)}
                icon={CreditCard}
                tone="positive"
              />
              <StatCard
                title="Total transactions"
                value={(summary?.totalCount ?? 0).toLocaleString()}
                icon={Filter}
                tone="default"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Status breakdown</h3>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(statusBreakdown).length ? (
                    (Object.entries(statusBreakdown) as [string, number][]).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                        <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p>No status data available.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Type breakdown</h3>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(typeBreakdown).length ? (
                    (Object.entries(typeBreakdown) as [string, number][]).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/70">
                        <span className="capitalize text-slate-600 dark:text-slate-300">{key.replace('_', ' ')}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p>No type data available.</p>
                  )}
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
              Refreshing transactions...
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment type</label>
            <select
              value={paymentType}
              onChange={(event) => {
                setPaymentType(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All types</option>
              <option value="booking">Booking</option>
              <option value="subscription">Subscription</option>
              <option value="service_fee">Service fee</option>
              <option value="refund">Refund</option>
              <option value="payout">Payout</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(event) => {
                setPaymentMethod(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All methods</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="paystack">Paystack</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gateway</label>
            <select
              value={gateway}
              onChange={(event) => {
                setGateway(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All gateways</option>
              <option value="paystack">Paystack</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Search</label>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Transaction ID, reference, description"
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
                <th className="px-4 py-3 text-left font-semibold">Transaction</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Property</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : transactions.length ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {transaction.description || `Txn #${transaction.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.transactionId ? `Gateway ref: ${transaction.transactionId}` : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Type: {transaction.paymentType}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {transaction.user
                          ? `${transaction.user.firstName} ${transaction.user.lastName}`
                          : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{transaction.user?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {transaction.property?.title ?? '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.property?.listingType ?? '—'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {transaction.status}
                      {transaction.failureReason ? (
                        <div className="mt-1 text-[11px] text-rose-500 dark:text-rose-300">{transaction.failureReason}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No transactions match the current filters.
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
    </div>
  );
};

export default TransactionsPage;


