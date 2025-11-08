import { useQuery } from '@tanstack/react-query';
import adminDashboardService from '../services/adminDashboard';

export const useAdminOverview = () =>
  useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => adminDashboardService.getOverview(),
    staleTime: 1000 * 60
  });

export const usePendingProperties = (enabled = false) =>
  useQuery({
    queryKey: ['admin-pending-properties'],
    queryFn: () => adminDashboardService.getPendingProperties(),
    enabled
  });


