import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminPropertiesService from '../services/adminProperties';
import type {
  AdminPropertiesResponse,
  AdminProperty,
  AdminPropertyFeaturePayload,
  AdminPropertyStatusPayload
} from '../services/types';

const PROPERTIES_KEY = 'admin-properties';

export const useAdminProperties = (params?: Record<string, unknown>) => {
  const queryKey = [PROPERTIES_KEY, params] as const;
  return useQuery<AdminPropertiesResponse, unknown, AdminPropertiesResponse, typeof queryKey>({
    queryKey,
    queryFn: () => adminPropertiesService.list(params),
    keepPreviousData: true
  });
};

export const useAdminPropertyDetail = (propertyId?: string, enabled?: boolean) => {
  const queryKey = [PROPERTIES_KEY, 'detail', propertyId] as const;
  return useQuery<AdminProperty | undefined, unknown, AdminProperty | undefined, typeof queryKey>({
    queryKey,
    queryFn: () => (propertyId ? adminPropertiesService.get(propertyId) : Promise.resolve(undefined)),
    enabled: Boolean(propertyId) && enabled !== false
  });
};

export const useAdminPropertyStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{
    success: boolean;
    message: string;
    data: AdminProperty;
  }, unknown, { propertyId: string; payload: AdminPropertyStatusPayload }>({
    mutationFn: ({ propertyId, payload }) => adminPropertiesService.updateStatus(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    }
  });
};

export const useAdminPropertyFeatureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{
    success: boolean;
    message: string;
    data: AdminProperty;
  }, unknown, { propertyId: string; payload: AdminPropertyFeaturePayload }>({
    mutationFn: ({ propertyId, payload }) => adminPropertiesService.updateFeature(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY, 'detail', propertyId] });
    }
  });
};


