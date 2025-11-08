import { useQuery } from '@tanstack/react-query';
import reportsService from '../services/reportsService';
import type { ReportsMetricsParams, ReportsMetricsResponse } from '../services/types';

const REPORTS_METRICS_KEY = 'admin-reports-metrics';

export const useReportsMetrics = (params?: ReportsMetricsParams) =>
  useQuery<ReportsMetricsResponse>({
    queryKey: [REPORTS_METRICS_KEY, params],
    queryFn: () => reportsService.getMetrics(params),
    staleTime: 5 * 60 * 1000
  });
