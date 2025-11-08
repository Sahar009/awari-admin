import api from '../lib/api';
import type { AdminTransactionsResponse } from './types';

export const transactionsService = {
  async list(params?: Record<string, unknown>) {
    const response = await api.get<{ success: boolean; data: AdminTransactionsResponse }>(
      '/admin/dashboard/transactions',
      { params }
    );
    return response.data.data;
  }
};

export default transactionsService;


