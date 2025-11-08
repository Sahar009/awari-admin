import { useQuery } from '@tanstack/react-query';
import transactionsService from '../services/transactionsService';

const TRANSACTIONS_KEY = 'admin-transactions';

export const useTransactions = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [TRANSACTIONS_KEY, params],
    queryFn: () => transactionsService.list(params),
    keepPreviousData: true
  });


