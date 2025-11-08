import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye, Loader, Star } from 'lucide-react';
import type { AdminProperty, PaginationMeta } from '../../services/types';
import { ActionButton } from '../ui/ActionButton';
import PropertyStatusBadge from './PropertyStatusBadge';

export type PropertyAction =
  | 'approve'
  | 'reject'
  | 'activate'
  | 'deactivate'
  | 'archive'
  | 'markSold'
  | 'markRented'
  | 'markPending';

interface PropertyTableProps {
  properties: AdminProperty[];
  isLoading?: boolean;
  isFetching?: boolean;
  pagination?: PaginationMeta;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onView: (propertyId: string) => void;
  onAction: (property: AdminProperty, action: PropertyAction) => void;
  onToggleFeature: (property: AdminProperty, nextFeaturedState: boolean) => void;
  statusMutationPending?: { propertyId: string; action: PropertyAction } | null;
  featureMutationPending?: string | null;
}

const actionLabels: Record<PropertyAction, string> = {
  approve: 'Approve',
  reject: 'Reject',
  activate: 'Activate',
  deactivate: 'Deactivate',
  archive: 'Archive',
  markSold: 'Mark sold',
  markRented: 'Mark rented',
  markPending: 'Send to review'
};

const getAvailableActions = (property: AdminProperty): PropertyAction[] => {
  const actions: PropertyAction[] = [];
  const { status, listingType } = property;

  switch (status) {
    case 'pending':
      actions.push('approve', 'reject');
      break;
    case 'active':
      actions.push('deactivate', 'archive');
      if (listingType === 'sale') actions.push('markSold');
      if (listingType === 'rent' || listingType === 'shortlet') actions.push('markRented');
      break;
    case 'inactive':
      actions.push('activate', 'markPending');
      break;
    case 'rejected':
      actions.push('markPending', 'activate');
      break;
    case 'archived':
      actions.push('activate');
      break;
    case 'sold':
    case 'rented':
      actions.push('activate');
      break;
    default:
      break;
  }

  return actions;
};

const formatCurrency = (value: number, currency = 'NGN') => {
  if (!value && value !== 0) return '—';
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

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <tr key={index}>
        <td colSpan={6} className="px-4 py-6">
          <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        </td>
      </tr>
    ))}
  </tbody>
);

export const PropertyTable = ({
  properties,
  isLoading,
  isFetching,
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onAction,
  onToggleFeature,
  statusMutationPending,
  featureMutationPending
}: PropertyTableProps) => {
  const totalItems = pagination?.totalItems ?? 0;
  const computedStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const computedEnd = totalItems === 0 ? 0 : Math.min(computedStart + properties.length - 1, totalItems);
  const paginationSummary =
    totalItems === 0 ? 'No properties to display' : `Showing ${computedStart}-${computedEnd} of ${totalItems} properties`;

  const hasPrev = pagination?.hasPrevPage ?? currentPage > 1;
  const hasNext = pagination?.hasNextPage ?? properties.length === pageSize;

  const pendingStatusId = statusMutationPending?.propertyId;
  const pendingFeatureId = featureMutationPending;

  const rows = useMemo(() => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (!properties.length) {
      return (
        <tbody>
          <tr>
            <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              No properties match your filters yet. Adjust filters or check back soon.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
        {properties.map((property) => {
          const coverImage = property.media?.[0]?.secureUrl || property.media?.[0]?.url;
          const actions = getAvailableActions(property);
          const isStatusMutating = pendingStatusId === property.id;
          const isFeatureMutating = pendingFeatureId === property.id;

          return (
            <tr key={property.id} className="text-sm text-slate-600 dark:text-slate-300">
              <td className="px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/60">
                    {coverImage ? (
                      <img src={coverImage} alt={property.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{property.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {[property.city, property.state].filter(Boolean).join(', ')}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200">
                        {property.listingType}
                      </span>
                      <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                        {property.propertyType}
                      </span>
                      {property.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-500/25 dark:text-amber-200">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="space-y-2">
                  <PropertyStatusBadge status={property.status} />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Created {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(property.price, property.currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Views: {property.viewCount ?? 0} • Contacts: {property.contactCount ?? 0}
                </div>
              </td>

              <td className="px-4 py-4">
                {property.owner ? (
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{property.owner.email}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Owner unavailable</p>
                )}
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ActionButton
                    variant="outline"
                    label="View"
                    startIcon={<Eye className="h-4 w-4" />}
                    onClick={() => onView(property.id)}
                  />
                  <ActionButton
                    variant={property.featured ? 'outline' : 'secondary'}
                    label={property.featured ? 'Unfeature' : 'Feature'}
                    startIcon={<Star className="h-4 w-4" />}
                    onClick={() => onToggleFeature(property, !property.featured)}
                    disabled={isFeatureMutating || isStatusMutating}
                  />
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {actions.map((action) => (
                    <ActionButton
                      key={action}
                      variant={
                        action === 'reject' || action === 'archive' ? 'outline' : action === 'deactivate' ? 'outline' : 'secondary'
                      }
                      label={actionLabels[action]}
                      onClick={() => onAction(property, action)}
                      disabled={isStatusMutating || isFeatureMutating}
                    />
                  ))}
                  {isStatusMutating ? <Loader className="h-4 w-4 animate-spin text-indigo-500" /> : null}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }, [
    featureMutationPending,
    onAction,
    onToggleFeature,
    onView,
    pendingStatusId,
    properties,
    isLoading
  ]);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 text-left font-semibold">Property</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Performance</th>
              <th className="px-4 py-3 text-left font-semibold">Owner</th>
              <th className="px-4 py-3 text-left font-semibold">Quick actions</th>
              <th className="px-4 py-3 text-left font-semibold">Moderation</th>
            </tr>
          </thead>
          {rows}
        </table>

        {isFetching && !isLoading ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-500 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200">
            <Loader className="h-3.5 w-3.5 animate-spin" />
            Refreshing properties…
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{paginationSummary}</p>
        <div className="flex items-center gap-3">
          <ActionButton
            variant="outline"
            label="Previous"
            startIcon={<ChevronLeft className="h-4 w-4" />}
            onClick={() => hasPrev && onPageChange(Math.max(currentPage - 1, 1))}
            disabled={!hasPrev || isFetching || isLoading}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination?.currentPage ?? currentPage} of {pagination?.totalPages ?? Math.max(Math.ceil(totalItems / pageSize), 1)}
          </span>
          <ActionButton
            variant="outline"
            label="Next"
            endIcon={<ChevronRight className="h-4 w-4" />}
            onClick={() => hasNext && onPageChange(currentPage + 1)}
            disabled={!hasNext || isFetching || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyTable;


