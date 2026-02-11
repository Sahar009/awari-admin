import { moderationQueue } from '../../data/dashboard';
import { ActionButton } from '../ui/ActionButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModerationListings, useApproveProperty, useRejectProperty } from '../../hooks/useModeration';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import type { ModerationListingItem } from '../../services/types';

// Fallback data when API is not available
const fallbackQueue: ModerationListingItem[] = moderationQueue.map((item, index) => {
  const [firstName = item.host ?? 'Host', lastName = ''] = (item.host ?? '').split(' ');
  return {
    id: `fallback-${index}`,
    title: item.name,
    listingType: item.type as any,
    status: (item.status ?? 'pending') as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    city: null,
    state: null,
    owner: item.host
      ? {
        id: `fallback-owner-${index}`,
        firstName,
        lastName,
        email: '',
        role: null
      }
      : null,
    agent: null,
    rejectionReason: null,
    moderationNotes: null
  };
});

const ModerationQueue: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useModerationListings({ limit: 5 });
  const approveMutation = useApproveProperty();
  const rejectMutation = useRejectProperty();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Use API data if available, otherwise use fallback
  const queue: ModerationListingItem[] = data?.listings ?? (isError ? fallbackQueue : []);

  const handleApprove = async (propertyId: string) => {
    setProcessingId(propertyId);
    approveMutation.mutate(
      { propertyId },
      {
        onSettled: () => setProcessingId(null)
      }
    );
  };

  const handleReject = (propertyId: string) => {
    setProcessingId(propertyId);
    // For quick reject from dashboard, use a default reason
    rejectMutation.mutate(
      { propertyId, reason: 'Does not meet listing standards' },
      {
        onSettled: () => setProcessingId(null)
      }
    );
  };

  return (
    <section
      id="moderation"
      className="mt-12 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Property moderation queue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Recent submissions waiting for approval.</p>
        </div>
        <ActionButton variant="secondary" label="View full queue" onClick={() => navigate('/moderation')} />
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 text-left font-semibold">Property</th>
              <th className="px-4 py-3 text-left font-semibold">Host</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Submitted</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                </td>
              </tr>
            )}
            {!isLoading && queue.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  All caught up! No properties awaiting moderation.
                </td>
              </tr>
            )}
            {queue.map((property) => (
              <tr key={property.id} className="text-sm text-slate-600 dark:text-slate-300">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                  {property.title}
                </td>
                <td className="px-4 py-4">
                  {property.owner
                    ? `${property.owner.firstName} ${property.owner.lastName}`.trim()
                    : '—'}
                </td>
                <td className="px-4 py-4 text-xs font-semibold uppercase text-indigo-500 dark:text-indigo-300">
                  {property.listingType}
                </td>
                <td className="px-4 py-4 text-xs text-slate-500">
                  {new Date(property.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="secondary"
                      label="Approve"
                      startIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleApprove(property.id)}
                      disabled={processingId === property.id || approveMutation.isPending || rejectMutation.isPending}
                    />
                    <ActionButton
                      variant="outline"
                      label="Reject"
                      startIcon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleReject(property.id)}
                      disabled={processingId === property.id || approveMutation.isPending || rejectMutation.isPending}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ModerationQueue;
