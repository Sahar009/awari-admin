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
  },

  async createUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: 'admin' | 'support_admin' | 'landlord' | 'renter' | 'hotel';
    userType?: string;
  }) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: {
        user: AdminUser;
        password: string;
        emailSent: boolean;
      };
    }>('/admin/dashboard/users', payload);
    return response.data;
  },

  async createPropertyForUser(userId: string, propertyData: any, images?: File[]) {
    const formData = new FormData();

    // Add property data to FormData
    Object.keys(propertyData).forEach(key => {
      if (propertyData[key] !== null && propertyData[key] !== undefined) {
        formData.append(key, propertyData[key].toString());
      }
    });

    // Add images to FormData
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post<{
      success: boolean;
      message: string;
      data: any;
    }>(`/admin/dashboard/users/${userId}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default adminUsersService;


