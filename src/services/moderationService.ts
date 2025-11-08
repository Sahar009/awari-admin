import api from '../lib/api';
import type {
  ModerationOverviewResponse,
  ModerationReviewsResponse,
  ModerationListingsResponse,
  ModerationKycResponse,
  ModerationPaymentsResponse,
  ModerationKycUpdatePayload,
  ModerationKycItem
} from './types';

export const moderationService = {
  async getOverview() {
    const response = await api.get<{ success: boolean; data: ModerationOverviewResponse }>(
      '/admin/dashboard/moderation/overview'
    );
    return response.data.data;
  },

  async getReviews(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: ModerationReviewsResponse }>(
      '/admin/dashboard/moderation/reviews',
      { params }
    );
    return response.data.data;
  },

  async getListings(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: ModerationListingsResponse }>(
      '/admin/dashboard/moderation/listings',
      { params }
    );
    return response.data.data;
  },

  async getKycDocuments(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: ModerationKycResponse }>(
      '/admin/dashboard/moderation/kyc',
      { params }
    );
    return response.data.data;
  },

  async getPayments(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: ModerationPaymentsResponse }>(
      '/admin/dashboard/moderation/payments',
      { params }
    );
    return response.data.data;
  },

  async updateKycDocument(documentId: string, payload: ModerationKycUpdatePayload) {
    const response = await api.put<{ success: boolean; data: ModerationKycItem; message?: string }>(
      `/admin/dashboard/moderation/kyc/${documentId}`,
      payload
    );
    return response.data;
  }
};

export default moderationService;


