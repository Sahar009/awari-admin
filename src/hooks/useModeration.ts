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
    queryFn: () => moderationService.getReviews(params),
    keepPreviousData: true
  });
};

export const useModerationListings = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'listings', params] as const;
  return useQuery<ModerationListingsResponse, unknown, ModerationListingsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getListings(params),
    keepPreviousData: true
  });
};

export const useModerationKyc = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'kyc', params] as const;
  return useQuery<ModerationKycResponse, unknown, ModerationKycResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getKycDocuments(params),
    keepPreviousData: true
  });
};

export const useModerationPayments = (params?: Record<string, unknown>) => {
  const queryKey = [MODERATION_KEY, 'payments', params] as const;
  return useQuery<ModerationPaymentsResponse, unknown, ModerationPaymentsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => moderationService.getPayments(params),
    keepPreviousData: true
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


