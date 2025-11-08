import api from '../lib/api';
import type {
  AdminSubscriptionPlan,
  AdminSubscriptionPlanListResponse,
  AdminSubscriptionPlanPayload,
  AdminSubscriptionPlanStatusPayload
} from './types';

const subscriptionPlansService = {
  async list(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: AdminSubscriptionPlanListResponse }>(
      '/admin/dashboard/subscription-plans',
      { params }
    );
    return response.data.data;
  },

  async get(planId: string) {
    const response = await api.get<{ success: boolean; data: AdminSubscriptionPlan }>(
      `/admin/dashboard/subscription-plans/${planId}`
    );
    return response.data.data;
  },

  async create(payload: AdminSubscriptionPlanPayload) {
    const response = await api.post<{ success: boolean; data: AdminSubscriptionPlan; message?: string }>(
      '/admin/dashboard/subscription-plans',
      payload
    );
    return response.data;
  },

  async update(planId: string, payload: Partial<AdminSubscriptionPlanPayload>) {
    const response = await api.put<{ success: boolean; data: AdminSubscriptionPlan; message?: string }>(
      `/admin/dashboard/subscription-plans/${planId}`,
      payload
    );
    return response.data;
  },

  async toggleStatus(planId: string, payload: AdminSubscriptionPlanStatusPayload) {
    const response = await api.post<{ success: boolean; data: AdminSubscriptionPlan; message?: string }>(
      `/admin/dashboard/subscription-plans/${planId}/status`,
      payload
    );
    return response.data;
  }
};

export default subscriptionPlansService;


