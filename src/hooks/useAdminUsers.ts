import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminUsersService from '../services/adminUsers';
import type { AdminUser } from '../services/auth';
import type {
  AdminUserDetailResponse,
  AdminUserProfileUpdatePayload,
  AdminUserProfile,
  CreateAdminUserPayload,
  CreateAdminUserResponse
} from '../services/types';

const USERS_KEY = 'admin-users';

export const useAdminUsers = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [USERS_KEY, params],
    queryFn: () => adminUsersService.list(params)
  });

export const useAdminUserDetail = (userId?: string, enabled = true) =>
  useQuery<AdminUserDetailResponse | undefined>({
    queryKey: [USERS_KEY, 'detail', userId],
    queryFn: () => (userId ? adminUsersService.get(userId) : Promise.resolve(undefined)),
    enabled: Boolean(userId) && enabled,
    staleTime: 60 * 1000
  });

export const useAdminUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ user: AdminUser }, unknown, { userId: string; action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve'; reason?: string }>({
    mutationFn: ({
      userId,
      action,
      reason
    }: {
      userId: string;
      action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve';
      reason?: string;
    }) => adminUsersService.updateStatus(userId, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY, 'detail'] });
    }
  });
};

export const useAdminUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ user: AdminUser }, unknown, { userId: string; role: string }>({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminUsersService.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY, 'detail'] });
    }
  });
};

export const useAdminUserProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      success: boolean;
      message: string;
      data: AdminUserProfile;
    },
    unknown,
    { userId: string; payload: AdminUserProfileUpdatePayload }
  >({
    mutationFn: ({ userId, payload }) => adminUsersService.updateProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY, 'detail'] });
    }
  });
};

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      success: boolean;
      message?: string;
      data: CreateAdminUserResponse;
    },
    unknown,
    CreateAdminUserPayload
  >({
    mutationFn: (payload) => adminUsersService.createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    }
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      success: boolean;
      message: string;
      data: {
        user: AdminUser;
        password: string;
        emailSent: boolean;
      };
    },
    unknown,
    {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
      role: 'admin' | 'support_admin' | 'landlord' | 'renter' | 'hotel';
      userType?: string;
    }
  >({
    mutationFn: (payload) => adminUsersService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    }
  });
};

export const useCreatePropertyForUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      success: boolean;
      message: string;
      data: any;
    },
    unknown,
    { userId: string; propertyData: any; images?: File[] }
  >({
    mutationFn: ({ userId, propertyData, images }) => adminUsersService.createPropertyForUser(userId, propertyData, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    }
  });
};
