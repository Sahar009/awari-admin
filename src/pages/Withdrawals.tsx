import { useState } from 'react';
import { Wallet, Loader, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import api from '../lib/api';

const formatCurrency = (value?: number, currency = 'NGN') => {
  if (value === undefined || value === null) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return value;
  }
};

interface WithdrawalRequest {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: string;
  description: string;
  metadata: {
    accountNumber?: string;
    accountName?: string;
    bankCode?: string;
    bankName?: string;
    bankDetails?: {
      accountNumber?: string;
      accountName?: string;
      bankCode?: string;
      bankName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/withdrawals?status=${statusFilter}`);
      
      if (response.data.success) {
        setWithdrawals(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      alert('Failed to fetch withdrawals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal? This will initiate the transfer.')) {
      return;
    }

    setProcessingId(withdrawalId);
    try {
      const response = await api.post(`/admin/withdrawals/${withdrawalId}/approve`);
      
      if (response.data.success) {
        alert('Withdrawal approved and processed successfully!');
        fetchWithdrawals();
      } else {
        alert(`Failed to approve withdrawal: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error approving withdrawal:', error);
      alert(error.response?.data?.message || 'Failed to approve withdrawal. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;

    setProcessingId(withdrawalId);
    try {
      const response = await api.post(`/admin/withdrawals/${withdrawalId}/reject`, { reason });
      
      if (response.data.success) {
        alert('Withdrawal rejected successfully!');
        fetchWithdrawals();
      } else {
        alert(`Failed to reject withdrawal: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error rejecting withdrawal:', error);
      alert(error.response?.data?.message || 'Failed to reject withdrawal. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: Clock },
      processing: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: Loader },
      completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: CheckCircle },
      failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', icon: XCircle },
      cancelled: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', icon: XCircle }
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="h-3.5 w-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Withdrawal Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review and process user withdrawal requests from their wallets.
            </p>
          </div>
          <ActionButton
            variant="secondary"
            label="Refresh"
            startIcon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchWithdrawals}
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['pending', 'processing', 'completed', 'failed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setTimeout(fetchWithdrawals, 100);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Load Button */}
        {withdrawals.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <ActionButton
              variant="primary"
              label="Load Withdrawals"
              startIcon={<Wallet className="h-4 w-4" />}
              onClick={fetchWithdrawals}
            />
          </div>
        )}
      </section>

      {/* Withdrawals List */}
      <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No {statusFilter} withdrawal requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {withdrawal.user
                            ? `${withdrawal.user.firstName} ${withdrawal.user.lastName}`
                            : 'Unknown User'}
                        </h3>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {withdrawal.user?.email || '—'}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(withdrawal.amount)}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        requested on {formatDateTime(withdrawal.createdAt)}
                      </span>
                    </div>

                    {/* Bank Details */}
                    {withdrawal.metadata?.bankDetails && (
                      <div className="grid gap-2 rounded-xl bg-white/70 p-4 dark:bg-slate-900/70 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Account Name
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {withdrawal.metadata.bankDetails.accountName || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Account Number
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {withdrawal.metadata.bankDetails.accountNumber || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Bank Name
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {withdrawal.metadata.bankDetails.bankName || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Bank Code
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {withdrawal.metadata.bankDetails.bankCode || '—'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {withdrawal.description && (
                      <div className="flex items-start gap-2 rounded-xl bg-blue-50/50 p-3 dark:bg-blue-900/20">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {withdrawal.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {withdrawal.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <ActionButton
                        variant="primary"
                        label="Approve & Process"
                        startIcon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleApprove(withdrawal.id)}
                        disabled={processingId === withdrawal.id}
                      />
                      <ActionButton
                        variant="outline"
                        label="Reject"
                        startIcon={<XCircle className="h-4 w-4" />}
                        onClick={() => handleReject(withdrawal.id)}
                        disabled={processingId === withdrawal.id}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WithdrawalsPage;
