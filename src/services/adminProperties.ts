import api from '../lib/api';
import type {
  AdminPropertiesResponse,
  AdminProperty,
  AdminPropertyFeaturePayload,
  AdminPropertyStatusPayload
} from './types';

export const adminPropertiesService = {
  async list(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: AdminPropertiesResponse }>(
      '/admin/dashboard/properties',
      {
        params
      }
    );
    return response.data.data;
  },

  async get(propertyId: string) {
    const response = await api.get<{ success: boolean; data: AdminProperty }>(
      `/admin/dashboard/properties/${propertyId}`
    );
    return response.data.data;
  },

  async updateStatus(propertyId: string, payload: AdminPropertyStatusPayload) {
    const response = await api.put<{ success: boolean; message: string; data: AdminProperty }>(
      `/admin/dashboard/properties/${propertyId}/status`,
      payload
    );
    return response.data;
  },

  async updateFeature(propertyId: string, payload: AdminPropertyFeaturePayload) {
    const response = await api.put<{ success: boolean; message: string; data: AdminProperty }>(
      `/admin/dashboard/properties/${propertyId}/feature`,
      payload
    );
    return response.data;
  }
};

export default adminPropertiesService;


















