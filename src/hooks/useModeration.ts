import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moderationService from '../services/moderationService';
import type {
  ModerationOverviewResponse,
  ModerationReviewsResponse,
  ModerationListingsResponse,
  ModerationKycResponse,
  ModerationPaymentsResponse,
  ModerationKycUpdatePayload,
  ModerationKycItem
} from '../services/types';

const MODERATION_KEY = 'admin-moderation';

export const useModerationOverview = () => {
  const queryKey = [MODERATION_KEY, 'overview'] as const;
  return useQuery<ModerationOverviewResponse, unknown, ModerationOverviewResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getOverview(),
    staleTime: 60 * 1000
  });
};

export const useModerationReviews = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'reviews', params] as const;
  return useQuery<ModerationReviewsResponse, unknown, ModerationReviewsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getReviews(params)
  });
};

export const useModerationListings = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'listings', params] as const;
  return useQuery<ModerationListingsResponse, unknown, ModerationListingsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getListings(params)
  });
};

export const useModerationKyc = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'kyc', params] as const;
  return useQuery<ModerationKycResponse, unknown, ModerationKycResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getKycDocuments(params)
  });
};

export const useModerationPayments = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'payments', params] as const;
  return useQuery<ModerationPaymentsResponse, unknown, ModerationPaymentsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getPayments(params)
  });
};

export const useModerationKycUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation<{
    success: boolean;
    data: ModerationKycItem;
    message?: string;
  }, unknown, { documentId: string; payload: ModerationKycUpdatePayload }>({
    mutationFn: ({ documentId, payload }) => moderationService.updateKycDocument(documentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'kyc'] });
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'overview'] });
    }
  });
};

/**
 * Hook to approve a property in moderation queue
 */
export const useApproveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, notes }: { propertyId: string; notes?: string }) => {
      return moderationService.approveProperty(propertyId, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'listings'] });
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['pending-properties'] });
    }
  });
};

/**
 * Hook to reject a property in moderation queue
 */
export const useRejectProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, reason, notes }: { propertyId: string; reason: string; notes?: string }) => {
      return moderationService.rejectProperty(propertyId, reason, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'listings'] });
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEY, 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['pending-properties'] });
    }
  });
};

