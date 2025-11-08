import api from '../lib/api';
import type {
  AdminUserListItem,
  AdminUserDetailResponse,
  AdminUserProfile,
  AdminUserProfileUpdatePayload,
  CreateAdminUserPayload,
  CreateAdminUserResponse,
  PaginationMeta
} from './types';
import type { AdminUser } from './auth';

export interface UsersListResponse {
  users: AdminUserListItem[];
  pagination: PaginationMeta;
}

export const adminUsersService = {
  async list(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: UsersListResponse }>('/admin/dashboard/users', {
      params
    });
    return response.data.data;
  },

  async createAdmin(payload: CreateAdminUserPayload) {
    const response = await api.post<{
      success: boolean;
      message?: string;
      data: CreateAdminUserResponse;
    }>('/admin/dashboard/users/admin', payload);
    return response.data;
  },

  async updateStatus(userId: string, action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve', reason?: string) {
    const response = await api.put<{ success: boolean; message: string; data: { user: AdminUser } }>(
      `/admin/dashboard/users/${userId}/status`,
      { action, reason }
    );
    return response.data.data;
  },

  async updateRole(userId: string, role: string) {
    const response = await api.put<{ success: boolean; data: { user: AdminUser } }>(
      `/admin/dashboard/users/${userId}/role`,
      { role }
    );
    return response.data.data;
  },

  async get(userId: string) {
    const response = await api.get<{ success: boolean; data: AdminUserDetailResponse }>(
      `/admin/dashboard/users/${userId}`
    );
    return response.data.data;
  },

  async updateProfile(userId: string, payload: AdminUserProfileUpdatePayload) {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: AdminUserProfile;
    }>(`/admin/dashboard/users/${userId}/profile`, payload);
    return response.data;
  }
};

export default adminUsersService;


