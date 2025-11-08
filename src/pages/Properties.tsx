import { useEffect, useMemo, useState } from 'react';
import type { AdminProperty } from '../services/types';
import {
  useAdminProperties,
  useAdminPropertyDetail,
  useAdminPropertyFeatureMutation,
  useAdminPropertyStatusMutation
} from '../hooks/useAdminProperties';
import PropertySummary from '../components/properties/PropertySummary';
import PropertyFilters, { type PropertyFiltersState } from '../components/properties/PropertyFilters';
import PropertyTable, { type PropertyAction } from '../components/properties/PropertyTable';
import PropertyModerationDialog from '../components/properties/PropertyModerationDialog';
import PropertyDetailsDrawer from '../components/properties/PropertyDetailsDrawer';

const PAGE_SIZE = 10;

const defaultFilters: PropertyFiltersState = {
  search: '',
  status: '',
  listingType: '',
  propertyType: '',
  featuredOnly: false
};

const extractErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object') {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    if (maybeResponse?.data?.message) {
      return maybeResponse.data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

const PropertiesPage = () => {
  const [filters, setFilters] = useState<PropertyFiltersState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [moderationContext, setModerationContext] = useState<{ property: AdminProperty; action: PropertyAction } | null>(
    null
  );
  const [pendingStatusAction, setPendingStatusAction] = useState<{ propertyId: string; action: PropertyAction } | null>(
    null
  );
  const [pendingFeatureId, setPendingFeatureId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page,
      limit: PAGE_SIZE
    };

    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.status) params.status = filters.status;
    if (filters.listingType) params.listingType = filters.listingType;
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.featuredOnly) params.featured = true;

    return params;
  }, [filters, page]);

  const { data, isLoading, isFetching } = useAdminProperties(queryParams);
  const statusMutation = useAdminPropertyStatusMutation();
  const featureMutation = useAdminPropertyFeatureMutation();
  const { data: detailData, isLoading: isDetailLoading } = useAdminPropertyDetail(
    selectedPropertyId ?? undefined,
    Boolean(selectedPropertyId)
  );

  const handleFilterChange = (partial: Partial<PropertyFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const closeModerationDialog = () => setModerationContext(null);

  const runStatusMutation = (
    property: AdminProperty,
    action: PropertyAction,
    payload: { status: AdminProperty['status']; rejectionReason?: string; moderationNotes?: string }
  ) => {
    setPendingStatusAction({ propertyId: property.id, action });
    statusMutation.mutate(
      { propertyId: property.id, payload },
      {
        onSuccess: (response) => {
          setFeedback({
            type: 'success',
            message: response?.message || `Property status updated to ${payload.status}`
          });
          setModerationContext(null);
        },
        onError: (error) => {
          setFeedback({
            type: 'error',
            message: extractErrorMessage(error)
          });
        },
        onSettled: () => {
          setPendingStatusAction(null);
        }
      }
    );
  };

  const runFeatureMutation = (property: AdminProperty, featured: boolean) => {
    setPendingFeatureId(property.id);
    featureMutation.mutate(
      { propertyId: property.id, payload: { featured } },
      {
        onSuccess: (response) => {
          setFeedback({
            type: 'success',
            message: response?.message || (featured ? 'Property featured successfully' : 'Property unfeatured successfully')
          });
        },
        onError: (error) => {
          setFeedback({
            type: 'error',
            message: extractErrorMessage(error)
          });
        },
        onSettled: () => setPendingFeatureId(null)
      }
    );
  };

  const handleAction = (property: AdminProperty, action: PropertyAction) => {
    if (['reject', 'deactivate', 'archive'].includes(action)) {
      setModerationContext({ property, action });
      return;
    }

    switch (action) {
      case 'approve':
      case 'activate':
        runStatusMutation(property, action, { status: 'active' });
        break;
      case 'markSold':
        runStatusMutation(property, action, { status: 'sold' });
        break;
      case 'markRented':
        runStatusMutation(property, action, { status: 'rented' });
        break;
      case 'markPending':
        runStatusMutation(property, action, { status: 'pending', moderationNotes: 'Returned to pending by admin' });
        break;
      default:
        break;
    }
  };

  const handleModerationSubmit = (input: { reason?: string; notes?: string }) => {
    if (!moderationContext) return;
    const { property, action } = moderationContext;

    if (action === 'reject') {
      runStatusMutation(property, action, {
        status: 'rejected',
        rejectionReason: input.reason,
        moderationNotes: input.notes
      });
      return;
    }

    if (action === 'deactivate') {
      runStatusMutation(property, action, {
        status: 'inactive',
        rejectionReason: input.reason,
        moderationNotes: input.notes
      });
      return;
    }

    if (action === 'archive') {
      runStatusMutation(property, action, {
        status: 'archived',
        rejectionReason: input.reason,
        moderationNotes: input.notes
      });
    }
  };

  const handleView = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const closeDetails = () => setSelectedPropertyId(null);

  return (
    <div className="space-y-8">
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

      <PropertySummary summary={data?.summary} isLoading={isLoading && !data} />

      <PropertyFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

      <PropertyTable
        properties={data?.properties ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={data?.pagination}
        currentPage={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onView={handleView}
        onAction={handleAction}
        onToggleFeature={runFeatureMutation}
        statusMutationPending={pendingStatusAction}
        featureMutationPending={pendingFeatureId}
      />

      <PropertyModerationDialog
        isOpen={Boolean(moderationContext)}
        action={(moderationContext?.action as 'reject' | 'deactivate' | 'archive') || 'reject'}
        propertyName={moderationContext?.property.title}
        onClose={closeModerationDialog}
        onSubmit={handleModerationSubmit}
        isSubmitting={statusMutation.isPending}
      />

      <PropertyDetailsDrawer
        isOpen={Boolean(selectedPropertyId)}
        property={detailData}
        isLoading={isDetailLoading}
        onClose={closeDetails}
      />
    </div>
  );
};

export default PropertiesPage;


