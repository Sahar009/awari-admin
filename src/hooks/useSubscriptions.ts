import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import subscriptionsService from '../services/subscriptionsService';
import type {
  AdminSubscriptionsResponse,
  AdminSubscriptionDetail,
  AdminSubscriptionCreatePayload,
  AdminSubscriptionUpdatePayload,
  AdminSubscriptionCancelPayload,
  AdminSubscriptionRenewPayload
} from '../services/types';

const SUBSCRIPTIONS_KEY = 'admin-subscriptions';

export const useSubscriptions = (params?: Record<string, unknown>) =>
  useQuery<AdminSubscriptionsResponse>({
    queryKey: [SUBSCRIPTIONS_KEY, params],
    queryFn: () => subscriptionsService.list(params),
    keepPreviousData: true
  });

export const useSubscriptionDetail = (subscriptionId?: string, enabled = true) =>
  useQuery<AdminSubscriptionDetail | undefined>({
    queryKey: [SUBSCRIPTIONS_KEY, 'detail', subscriptionId],
    queryFn: () => (subscriptionId ? subscriptionsService.get(subscriptionId) : Promise.resolve(undefined)),
    enabled: Boolean(subscriptionId) && enabled,
    staleTime: 60 * 1000
  });

export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; data: AdminSubscriptionDetail; message?: string }, unknown, AdminSubscriptionCreatePayload>({
    mutationFn: (payload) => subscriptionsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY] });
    }
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; data: AdminSubscriptionDetail; message?: string },
    unknown,
    { subscriptionId: string; payload: AdminSubscriptionUpdatePayload }
  >({
    mutationFn: ({ subscriptionId, payload }) => subscriptionsService.update(subscriptionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY, 'detail', variables.subscriptionId] });
    }
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; data: AdminSubscriptionDetail; message?: string },
    unknown,
    { subscriptionId: string; payload: AdminSubscriptionCancelPayload }
  >({
    mutationFn: ({ subscriptionId, payload }) => subscriptionsService.cancel(subscriptionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY, 'detail', variables.subscriptionId] });
    }
  });
};

export const useRenewSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; data: AdminSubscriptionDetail; message?: string },
    unknown,
    { subscriptionId: string; payload: AdminSubscriptionRenewPayload }
  >({
    mutationFn: ({ subscriptionId, payload }) => subscriptionsService.renew(subscriptionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_KEY, 'detail', variables.subscriptionId] });
    }
  });
};



