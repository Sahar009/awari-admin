import { useMemo, useState } from 'react';
import { AlertTriangle, Filter, Loader, ShieldAlert, Star, Building2, CreditCard, IdCard } from 'lucide-react';
import {
  useModerationOverview,
  useModerationReviews,
  useModerationListings,
  useModerationKyc,
  useModerationPayments,
  useModerationKycUpdate
} from '../hooks/useModeration';
import { ActionButton } from '../components/ui/ActionButton';
import type {
  ModerationKycItem,
  ModerationKycUpdatePayload,
  ModerationReviewItem,
  ModerationListingItem,
  ModerationPaymentItem
} from '../services/types';
import KycDocumentDrawer from '../components/moderation/KycDocumentDrawer';

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

const SectionContainer = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      {description ? <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
    {children}
  </section>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent = 'default'
}: {
  title: string;
  value: number | string;
  icon: typeof Users;
  accent?: 'default' | 'warning' | 'danger';
}) => {
  const badgeMap = {
    default: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200',
    warning: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200',
    danger: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200'
  } as const;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badgeMap[accent]}`}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

const ModerationPage = () => {
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'flagged' | 'all'>('pending');

  const [listingPage, setListingPage] = useState(1);
  const [listingStatus, setListingStatus] = useState<'pending' | 'rejected' | 'archived' | 'flagged' | 'all'>('pending');
  const [listingType, setListingType] = useState<'all' | 'rent' | 'sale' | 'shortlet'>('all');

  const [kycPage, setKycPage] = useState(1);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected' | 'expired'>('pending');
  const [selectedKycDocument, setSelectedKycDocument] = useState<ModerationKycItem | undefined>(undefined);
  const [kycDrawerOpen, setKycDrawerOpen] = useState(false);
  const [kycFeedback, setKycFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<string>('failed');

  const { data: overviewData, isLoading: isOverviewLoading } = useModerationOverview();
  const { data: reviewData, isLoading: isReviewsLoading, isFetching: isReviewsFetching } = useModerationReviews({
    page: reviewPage,
    filter: reviewFilter
  });
  const { data: listingData, isLoading: isListingsLoading, isFetching: isListingsFetching } = useModerationListings({
    page: listingPage,
    status: listingStatus === 'all' ? undefined : listingStatus,
    listingType: listingType === 'all' ? undefined : listingType
  });
  const { data: kycData, isLoading: isKycLoading, isFetching: isKycFetching } = useModerationKyc({
    page: kycPage,
    status: kycStatus
  });
  const kycUpdateMutation = useModerationKycUpdate();
  const { data: paymentData, isLoading: isPaymentsLoading, isFetching: isPaymentsFetching } = useModerationPayments({
    page: paymentsPage,
    status: paymentStatus
  });

  const reviews: ModerationReviewItem[] = reviewData?.reviews ?? [];
  const listings: ModerationListingItem[] = listingData?.listings ?? [];
  const kycDocuments: ModerationKycItem[] = kycData?.documents ?? [];
  const payments: ModerationPaymentItem[] = paymentData?.payments ?? [];

  const reviewPagination = reviewData?.pagination;
  const listingPagination = listingData?.pagination;
  const kycPagination = kycData?.pagination;
  const paymentsPagination = paymentData?.pagination;

  const overviewCards = useMemo(
    () => [
      {
        title: 'Pending properties',
        value: overviewData?.pendingProperties ?? 0,
        icon: Building2,
        accent: 'warning'
      },
      {
        title: 'Pending reviews',
        value: overviewData?.pendingReviews ?? 0,
        icon: Star,
        accent: 'warning'
      },
      {
        title: 'Flagged reviews',
        value: overviewData?.flaggedReviews ?? 0,
        icon: ShieldAlert,
        accent: 'danger'
      },
      {
        title: 'Pending KYC checks',
        value: overviewData?.pendingKyc ?? 0,
        icon: IdCard,
        accent: 'warning'
      },
      {
        title: 'Reported listings',
        value: overviewData?.reportedListings ?? 0,
        icon: AlertTriangle,
        accent: 'danger'
      },
      {
        title: 'Payment disputes',
        value: overviewData?.paymentDisputes ?? 0,
        icon: CreditCard,
        accent: 'warning'
      }
    ],
    [overviewData]
  );

  const handleOpenKycDrawer = (doc: ModerationKycItem) => {
    setSelectedKycDocument(doc);
    setKycFeedback(null);
    setKycDrawerOpen(true);
  };

  const handleCloseKycDrawer = () => {
    setKycDrawerOpen(false);
    setSelectedKycDocument(undefined);
    setKycFeedback(null);
  };

  const handleKycSave = (payload: ModerationKycUpdatePayload) => {
    if (!selectedKycDocument) return;
    setKycFeedback(null);
    kycUpdateMutation.mutate(
      { documentId: selectedKycDocument.id, payload },
      {
        onSuccess: (response) => {
          setKycFeedback({
            type: 'success',
            message: response.message || 'KYC document updated successfully.'
          });
        },
        onError: (error) => {
          setKycFeedback({
            type: 'error',
            message:
              error instanceof Error ? error.message : 'Failed to update KYC document. Please try again.'
          });
        }
      }
    );
  };

  return (
    <div className="space-y-8">
      <SectionContainer title="Moderation overview" description="Monitor critical queues requiring admin attention.">
        {isOverviewLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading overview metrics...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map((card) => (
              <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} accent={card.accent as any} />
            ))}
          </div>
        )}
      </SectionContainer>

      <SectionContainer
        title="Review moderation"
        description="Reviews awaiting validation or flagged by users for potential policy violations."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={reviewFilter}
              onChange={(event) => {
                setReviewPage(1);
                setReviewFilter(event.target.value as typeof reviewFilter);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="all">All</option>
            </select>
          </div>
          {isReviewsFetching ? (
            <div className="flex items-center gap-2 text-xs text-indigo-500">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              Refreshing reviews...
            </div>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Review</th>
                <th className="px-4 py-3 text-left font-semibold">Reviewer</th>
                <th className="px-4 py-3 text-left font-semibold">Property</th>
                <th className="px-4 py-3 text-left font-semibold">Flags</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isReviewsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : reviews.length ? (
                reviews.map((review) => (
                  <tr key={review.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {review.title || `Review #${review.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {review.reviewType} • Rating {review.rating}/5
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {review.reviewer
                          ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                          : 'Unknown reviewer'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{review.reviewer?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {review.property?.title ?? 'Unknown property'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{review.property?.listingType ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      Flags: {review.reportCount ?? 0} • Helpful: {review.helpfulCount ?? 0}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(review.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No reviews match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {reviewPagination ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>
              Page {reviewPagination.currentPage} of {reviewPagination.totalPages}
            </span>
            <div className="flex items-center gap-3">
              <ActionButton
                variant="outline"
                label="Previous"
                onClick={() => reviewPagination.hasPrevPage && setReviewPage((prev) => Math.max(prev - 1, 1))}
                disabled={!reviewPagination.hasPrevPage || isReviewsFetching}
              />
              <ActionButton
                variant="outline"
                label="Next"
                onClick={() => reviewPagination.hasNextPage && setReviewPage((prev) => prev + 1)}
                disabled={!reviewPagination.hasNextPage || isReviewsFetching}
              />
            </div>
          </div>
        ) : null}
      </SectionContainer>

      <SectionContainer
        title="Listing moderation"
        description="Properties awaiting approval or flagged by the community for policy review."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={listingStatus}
              onChange={(event) => {
                setListingPage(1);
                setListingStatus(event.target.value as typeof listingStatus);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
              <option value="flagged">Flagged</option>
              <option value="all">All</option>
            </select>
            <select
              value={listingType}
              onChange={(event) => {
                setListingPage(1);
                setListingType(event.target.value as typeof listingType);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
            >
              <option value="all">All types</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
              <option value="shortlet">Shortlet</option>
            </select>
          </div>
          {isListingsFetching ? (
            <div className="flex items-center gap-2 text-xs text-indigo-500">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              Refreshing listings...
            </div>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Listing</th>
                <th className="px-4 py-3 text-left font-semibold">Owner</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                <th className="px-4 py-3 text-left font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isListingsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : listings.length ? (
                listings.map((listing) => (
                  <tr key={listing.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{listing.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {listing.listingType} • {listing.city}, {listing.state}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {listing.owner ? `${listing.owner.firstName} ${listing.owner.lastName}` : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{listing.owner?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{listing.status}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {listing.rejectionReason || listing.moderationNotes || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(listing.updatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No listings match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {listingPagination ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>
              Page {listingPagination.currentPage} of {listingPagination.totalPages}
            </span>
            <div className="flex items-center gap-3">
              <ActionButton
                variant="outline"
                label="Previous"
                onClick={() => listingPagination.hasPrevPage && setListingPage((prev) => Math.max(prev - 1, 1))}
                disabled={!listingPagination.hasPrevPage || isListingsFetching}
              />
              <ActionButton
                variant="outline"
                label="Next"
                onClick={() => listingPagination.hasNextPage && setListingPage((prev) => prev + 1)}
                disabled={!listingPagination.hasNextPage || isListingsFetching}
              />
            </div>
          </div>
        ) : null}
      </SectionContainer>

      <SectionContainer
        title="KYC verification"
        description="User-submitted identity documents pending manual verification."
      >
        <KycDocumentDrawer
          isOpen={kycDrawerOpen}
          document={selectedKycDocument}
          isSaving={kycUpdateMutation.isPending}
          onClose={handleCloseKycDrawer}
          onSave={handleKycSave}
          feedback={kycFeedback}
        />
        <div className="flex items-center gap-3">
          <select
            value={kycStatus}
            onChange={(event) => {
              setKycPage(1);
              setKycStatus(event.target.value as typeof kycStatus);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
          {isKycFetching ? (
            <div className="flex items-center gap-2 text-xs text-indigo-500">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              Refreshing KYC records...
            </div>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Document</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isKycLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : kycDocuments.length ? (
                kycDocuments.map((doc) => (
                  <tr key={doc.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{doc.documentType}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">ID: {doc.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{doc.user?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{doc.status}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {doc.verificationNotes || doc.rejectionReason || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(doc.createdAt)}</td>
                    <td className="px-4 py-4">
                      <ActionButton variant="outline" label="View" onClick={() => handleOpenKycDrawer(doc)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No KYC records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {kycPagination ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>
              Page {kycPagination.currentPage} of {kycPagination.totalPages}
            </span>
            <div className="flex items-center gap-3">
              <ActionButton
                variant="outline"
                label="Previous"
                onClick={() => kycPagination.hasPrevPage && setKycPage((prev) => Math.max(prev - 1, 1))}
                disabled={!kycPagination.hasPrevPage || isKycFetching}
              />
              <ActionButton
                variant="outline"
                label="Next"
                onClick={() => kycPagination.hasNextPage && setKycPage((prev) => prev + 1)}
                disabled={!kycPagination.hasNextPage || isKycFetching}
              />
            </div>
          </div>
        ) : null}
      </SectionContainer>

      <SectionContainer
        title="Payments requiring attention"
        description="Failed or refunded payments that may need manual intervention."
      >
        <div className="flex items-center gap-3">
          <select
            value={paymentStatus}
            onChange={(event) => {
              setPaymentsPage(1);
              setPaymentStatus(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
          >
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
            <option value="failed,refunded">Failed & refunded</option>
          </select>
          {isPaymentsFetching ? (
            <div className="flex items-center gap-2 text-xs text-indigo-500">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              Refreshing payments...
            </div>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Payment</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Property</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isPaymentsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : payments.length ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {payment.description || `Payment #${payment.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatCurrency(payment.amount, payment.currency)} • Method {payment.paymentMethod}
                      </div>
                      {payment.transactionId ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400">Txn: {payment.transactionId}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{payment.user?.email ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {payment.property?.title ?? '—'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{payment.property?.listingType ?? '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {payment.status}
                      {payment.failureReason ? (
                        <div className="mt-1 text-[11px] text-rose-500 dark:text-rose-300">{payment.failureReason}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(payment.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No payments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paymentsPagination ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>
              Page {paymentsPagination.currentPage} of {paymentsPagination.totalPages}
            </span>
            <div className="flex items-center gap-3">
              <ActionButton
                variant="outline"
                label="Previous"
                onClick={() => paymentsPagination.hasPrevPage && setPaymentsPage((prev) => Math.max(prev - 1, 1))}
                disabled={!paymentsPagination.hasPrevPage || isPaymentsFetching}
              />
              <ActionButton
                variant="outline"
                label="Next"
                onClick={() => paymentsPagination.hasNextPage && setPaymentsPage((prev) => prev + 1)}
                disabled={!paymentsPagination.hasNextPage || isPaymentsFetching}
              />
            </div>
          </div>
        ) : null}
      </SectionContainer>
    </div>
  );
};

export default ModerationPage;


