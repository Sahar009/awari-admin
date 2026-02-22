import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteConfigService, type CreateSiteConfigPayload, type UpdateSiteConfigPayload } from '../services/siteConfigService';

// Fetch site configs
export const useSiteConfigs = (params?: { page?: number; limit?: number; search?: string; category?: string; type?: string }) => {
  return useQuery({
    queryKey: ['siteConfigs', params],
    queryFn: () => siteConfigService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create/update site config
export const useUpsertSiteConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: CreateSiteConfigPayload }) => 
      siteConfigService.upsert(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteConfigs'] });
    },
  });
};

// Update site config
export const useUpdateSiteConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSiteConfigPayload }) => 
      siteConfigService.update(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteConfigs'] });
    },
  });
};

// Delete site config
export const useDeleteSiteConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (key: string) => siteConfigService.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteConfigs'] });
    },
  });
};

// Toggle site config status
export const useToggleSiteConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (key: string) => siteConfigService.toggleActive(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteConfigs'] });
    },
  });
};
