import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moderationService from '../services/moderationService';
import type { ModerationKycUpdatePayload, ModerationKycItem } from '../services/types';

const MODERATION_KEY = 'admin-moderation';

export const useModerationOverview = () =>
  useQuery({
    queryKey: [MODERATION_KEY, 'overview'],
    queryFn: () => moderationService.getOverview(),
    staleTime: 60 * 1000
  });

export const useModerationReviews = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [MODERATION_KEY, 'reviews', params],
    queryFn: () => moderationService.getReviews(params),
    keepPreviousData: true
  });

export const useModerationListings = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [MODERATION_KEY, 'listings', params],
    queryFn: () => moderationService.getListings(params),
    keepPreviousData: true
  });

export const useModerationKyc = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [MODERATION_KEY, 'kyc', params],
    queryFn: () => moderationService.getKycDocuments(params),
    keepPreviousData: true
  });

export const useModerationPayments = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [MODERATION_KEY, 'payments', params],
    queryFn: () => moderationService.getPayments(params),
    keepPreviousData: true
  });

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


