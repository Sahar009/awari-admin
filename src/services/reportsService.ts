import api from '../lib/api';
import type { ReportsMetricsParams, ReportsMetricsResponse } from './types';

const reportsService = {
  async getMetrics(params?: ReportsMetricsParams) {
    const response = await api.get<{ success: boolean; data: ReportsMetricsResponse }>(
      '/admin/dashboard/reports/metrics',
      { params }
    );
    return response.data.data;
  }
};

export default reportsService;
















