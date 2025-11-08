import { moderationQueue } from '../../data/dashboard';
import { ActionButton } from '../ui/ActionButton';
import React from 'react';
import { usePendingProperties } from '../../hooks/useAdminDashboard';
import { Loader } from 'lucide-react';

const ModerationQueue: React.FC = () => {
  const { data, isLoading } = usePendingProperties(true);
  const queue = data?.properties ?? moderationQueue;

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
        <ActionButton variant="secondary" label="View full queue" />
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
              <tr key={property.id ?? property.name} className="text-sm text-slate-600 dark:text-slate-300">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                  {property.title ?? property.name}
                </td>
                <td className="px-4 py-4">
                  {property.owner
                    ? `${property.owner.firstName} ${property.owner.lastName}`
                    : property.host ?? 'Host'}
                </td>
                <td className="px-4 py-4 text-xs font-semibold uppercase text-indigo-500 dark:text-indigo-300">
                  {property.listingType ?? property.type}
                </td>
                <td className="px-4 py-4 text-xs text-slate-500">
                  {property.createdAt ? new Date(property.createdAt).toLocaleString() : property.date}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton variant="secondary" label="Approve" />
                    <ActionButton variant="outline" label="Reject" />
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


