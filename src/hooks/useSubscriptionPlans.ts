import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import subscriptionPlansService from '../services/subscriptionPlans';
import type {
  AdminSubscriptionPlanListResponse,
  AdminSubscriptionPlan,
  AdminSubscriptionPlanPayload,
  AdminSubscriptionPlanStatusPayload
} from '../services/types';

const SUBSCRIPTION_PLANS_KEY = 'admin-subscription-plans';

export const useSubscriptionPlans = (params?: Record<string, unknown>) =>
  useQuery<AdminSubscriptionPlanListResponse>({
    queryKey: [SUBSCRIPTION_PLANS_KEY, params],
    queryFn: () => subscriptionPlansService.list(params),
    keepPreviousData: true
  });

export const useSubscriptionPlanDetail = (planId?: string, enabled = true) =>
  useQuery<AdminSubscriptionPlan | undefined>({
    queryKey: [SUBSCRIPTION_PLANS_KEY, 'detail', planId],
    queryFn: () => (planId ? subscriptionPlansService.get(planId) : Promise.resolve(undefined)),
    enabled: Boolean(planId) && enabled,
    staleTime: 60 * 1000
  });

export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; data: AdminSubscriptionPlan; message?: string }, unknown, AdminSubscriptionPlanPayload>({
    mutationFn: (payload) => subscriptionPlansService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_PLANS_KEY] });
    }
  });
};

export const useUpdateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; data: AdminSubscriptionPlan; message?: string },
    unknown,
    { planId: string; payload: Partial<AdminSubscriptionPlanPayload> }
  >({
    mutationFn: ({ planId, payload }) => subscriptionPlansService.update(planId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_PLANS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_PLANS_KEY, 'detail', variables.planId] });
    }
  });
};

export const useToggleSubscriptionPlanStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; data: AdminSubscriptionPlan; message?: string },
    unknown,
    { planId: string; payload: AdminSubscriptionPlanStatusPayload }
  >({
    mutationFn: ({ planId, payload }) => subscriptionPlansService.toggleStatus(planId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_PLANS_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_PLANS_KEY, 'detail', variables.planId] });
    }
  });
};


