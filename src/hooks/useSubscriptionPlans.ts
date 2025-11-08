import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import subscriptionPlansService from '../services/subscriptionPlans';
import type {
  AdminSubscriptionPlanListResponse,
  AdminSubscriptionPlan,
  AdminSubscriptionPlanPayload,
  AdminSubscriptionPlanStatusPayload
} from '../services/types';

const SUBSCRIPTION_PLANS_KEY = 'admin-subscription-plans';

export const useSubscriptionPlans = (params?: Record<string, unknown>) => {
  const queryKey = [SUBSCRIPTION_PLANS_KEY, params] as const;
  return useQuery<
    AdminSubscriptionPlanListResponse,
    unknown,
    AdminSubscriptionPlanListResponse,
    typeof queryKey
  >({
    queryKey,
    queryFn: () => subscriptionPlansService.list(params)
  });
};

export const useSubscriptionPlanDetail = (planId?: string, enabled = true) => {
  const queryKey = [SUBSCRIPTION_PLANS_KEY, 'detail', planId] as const;
  return useQuery<AdminSubscriptionPlan | undefined, unknown, AdminSubscriptionPlan | undefined, typeof queryKey>({
    queryKey,
    queryFn: () => (planId ? subscriptionPlansService.get(planId) : Promise.resolve(undefined)),
    enabled: Boolean(planId) && enabled,
    staleTime: 60 * 1000
  });
};

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


