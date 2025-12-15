import api from '../lib/api';
import type { PaginationMeta } from './types';

export interface OverviewMetrics {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

export interface OverviewBreakdown {
  usersByRole: Record<string, number>;
  propertiesByStatus: Record<string, number>;
  bookingsByStatus: Record<string, number>;
}

export interface OverviewRecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface OverviewRecentProperty {
  id: string;
  title: string;
  listingType: string;
  status: string;
  createdAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AdminOverviewResponse {
  totals: OverviewMetrics;
  usersByRole: Record<string, number>;
  propertiesByStatus: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  recentUsers: OverviewRecentUser[];
  recentProperties: OverviewRecentProperty[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export const adminDashboardService = {
  async getOverview(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: AdminOverviewResponse }>('/admin/dashboard/overview', {
      params
    });
    return response.data.data;
  },

  async getPendingProperties(params?: Record<string, unknown>) {
    const response = await api.get<{
      success: boolean;
      data: { properties: OverviewRecentProperty[]; pagination: PaginationMeta };
    }>('/admin/dashboard/properties/pending', { params });
    return response.data.data;
  }
};

export default adminDashboardService;


















