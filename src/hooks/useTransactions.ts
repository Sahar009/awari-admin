import { useQuery } from '@tanstack/react-query';
import transactionsService from '../services/transactionsService';
import type { AdminTransactionsResponse } from '../services/types';

const TRANSACTIONS_KEY = 'admin-transactions';

export const useTransactions = (params?: Record<string, unknown>) => {
  const queryKey = [TRANSACTIONS_KEY, params] as const;
  return useQuery<AdminTransactionsResponse, unknown, AdminTransactionsResponse, typeof queryKey>({
    queryKey,
    queryFn: () => transactionsService.list(params)
  });
};


