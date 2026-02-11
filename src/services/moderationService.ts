import api from '../lib/api';
import type {
  ModerationOverviewResponse,
  ModerationReviewsResponse,
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
    const response = await api.get<{
      success: boolean;
      data: { listings: any[]; pagination: any }
    }>(
      '/admin/dashboard/moderation/listings',
      { params }
    );
    // API returns listings directly
    return {
      listings: response.data.data.listings,
      pagination: response.data.data.pagination
    };
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
  },

  async approveProperty(propertyId: string, notes?: string) {
    const payload = {
      status: 'active' as const,
      moderationNotes: notes
    };

    const response = await api.put<{ success: boolean; message: string; data: unknown }>(
      `/admin/dashboard/properties/${propertyId}/moderate`,
      payload
    );
    return response.data;
  },

  async rejectProperty(propertyId: string, reason: string, notes?: string) {
    const payload = {
      status: 'rejected' as const,
      rejectionReason: reason,
      moderationNotes: notes
    };

    const response = await api.put<{ success: boolean; message: string; data: unknown }>(
      `/admin/dashboard/properties/${propertyId}/moderate`,
      payload
    );
    return response.data;
  }
};

export default moderationService;


