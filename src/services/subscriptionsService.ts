import api from '../lib/api';
import type {
  AdminSubscriptionsResponse,
  AdminSubscriptionDetail,
  AdminSubscriptionCreatePayload,
  AdminSubscriptionUpdatePayload,
  AdminSubscriptionCancelPayload,
  AdminSubscriptionRenewPayload
} from './types';

export const subscriptionsService = {
  async list(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: AdminSubscriptionsResponse }>(
      '/admin/dashboard/subscriptions',
      { params }
    );
    return response.data.data;
  },

  async get(subscriptionId: string) {
    const response = await api.get<{ success: boolean; data: AdminSubscriptionDetail }>(
      `/admin/dashboard/subscriptions/${subscriptionId}`
    );
    return response.data.data;
  },

  async create(payload: AdminSubscriptionCreatePayload) {
    const response = await api.post<{ success: boolean; data: AdminSubscriptionDetail; message?: string }>(
      '/admin/dashboard/subscriptions',
      payload
    );
    return response.data;
  },

  async update(subscriptionId: string, payload: AdminSubscriptionUpdatePayload) {
    const response = await api.put<{ success: boolean; data: AdminSubscriptionDetail; message?: string }>(
      `/admin/dashboard/subscriptions/${subscriptionId}`,
      payload
    );
    return response.data;
  },

  async cancel(subscriptionId: string, payload: AdminSubscriptionCancelPayload) {
    const response = await api.post<{ success: boolean; data: AdminSubscriptionDetail; message?: string }>(
      `/admin/dashboard/subscriptions/${subscriptionId}/cancel`,
      payload
    );
    return response.data;
  },

  async renew(subscriptionId: string, payload: AdminSubscriptionRenewPayload) {
    const response = await api.post<{ success: boolean; data: AdminSubscriptionDetail; message?: string }>(
      `/admin/dashboard/subscriptions/${subscriptionId}/renew`,
      payload
    );
    return response.data;
  }
};

export default subscriptionsService;


