'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { PayrollRun, PayrollRunListParams, PayrollRunOption } from './types';
import type { PaginationMeta } from '@/lib/api/api-types';

export const payrollRunKeys = {
  all: ['payroll-runs'] as const,
  lists: () => [...payrollRunKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...payrollRunKeys.lists(), filters] as const,
  details: () => [...payrollRunKeys.all, 'detail'] as const,
  detail: (id: number) => [...payrollRunKeys.details(), id] as const,
  options: () => [...payrollRunKeys.all, 'options'] as const,
  entries: (runId: number) => [...payrollRunKeys.all, 'entries', runId] as const,
};

const BASE_PATH = '/payroll-runs';

export interface PayrollRunsPaginatedResponse {
  data: PayrollRun[];
  meta?: PaginationMeta;
}

export function usePaginatedPayrollRuns(params?: PayrollRunListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: payrollRunKeys.list(params),
    queryFn: async () => {
      const response = await api.get<PayrollRunsPaginatedResponse>(BASE_PATH, { params });
      return response.data ?? { data: [], meta: undefined };
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function usePayrollRunOptions() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: payrollRunKeys.options(),
    queryFn: async () => {
      const response = await api.get<PayrollRunOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function usePayrollRun(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: payrollRunKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<PayrollRun>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreatePayrollRun() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { month: string; year: number; status?: string }) => {
      const response = await api.post<{ data: PayrollRun }>(BASE_PATH, body);
      if (!response.success || !response.data) throw new Error(response.message ?? 'Failed to create payroll run');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollRunKeys.lists() });
      queryClient.invalidateQueries({ queryKey: payrollRunKeys.options() });
      toast.success('Payroll run created');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useGeneratePayrollEntries() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (runId: number) => {
      const response = await api.post<{ data: PayrollRun }>(`${BASE_PATH}/${runId}/generate-entries`, {});
      if (!response.success || !response.data) throw new Error(response.message ?? 'Failed to generate entries');
      return response;
    },
    onSuccess: (_, runId) => {
      queryClient.invalidateQueries({ queryKey: payrollRunKeys.lists() });
      queryClient.invalidateQueries({ queryKey: payrollRunKeys.detail(runId) });
      toast.success('Payroll entries generated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function usePayrollRunEntries(runId: number, params?: { page?: number; per_page?: number }) {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: [...payrollRunKeys.entries(runId), params],
    queryFn: async () => {
      const response = await api.get<{ data: PayrollRun['entries']; meta?: PaginationMeta }>(
        `${BASE_PATH}/${runId}/entries`,
        { params }
      );
      return response.data ?? { data: [], meta: undefined };
    },
    enabled: !!runId && sessionStatus !== 'loading',
  });
}
