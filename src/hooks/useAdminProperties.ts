import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminPropertiesService from '../services/adminProperties';
import type {
  AdminPropertiesResponse,
  AdminProperty,
  AdminPropertyFeaturePayload,
  AdminPropertyStatusPayload
} from '../services/types';

const PROPERTIES_KEY = 'admin-properties';

export const useAdminProperties = (params?: Record<string, unknown>) =>
  useQuery<AdminPropertiesResponse>({
    queryKey: [PROPERTIES_KEY, params],
    queryFn: () => adminPropertiesService.list(params),
    keepPreviousData: true
  });

export const useAdminPropertyDetail = (propertyId?: string, enabled?: boolean) =>
  useQuery<AdminProperty | undefined>({
    queryKey: [PROPERTIES_KEY, 'detail', propertyId],
    queryFn: () => (propertyId ? adminPropertiesService.get(propertyId) : undefined),
    enabled: Boolean(propertyId) && enabled !== false
  });

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


