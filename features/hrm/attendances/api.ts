'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Attendance,
  AttendanceExportParams,
  AttendanceFormBody,
  AttendanceListParams,
} from './types'

export const attendanceKeys = {
  all: ['attendances'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...attendanceKeys.lists(), filters] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...attendanceKeys.details(), id] as const,
  template: () => [...attendanceKeys.all, 'template'] as const,
};

const BASE_PATH = '/attendances';

export function usePaginatedAttendances(params?: AttendanceListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: async () => {
      return await api.get<Attendance[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useAttendance(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: attendanceKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Attendance>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateAttendance() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttendanceFormBody) => {
      const payload: Record<string, unknown> = {
        employee_ids: data.employee_ids,
        date: data.date,
        checkin: data.checkin,
      };

      if (data.checkout !== undefined && data.checkout !== null) {
        payload.checkout = data.checkout;
      }

      if (data.note !== undefined && data.note !== null) {
        payload.note = data.note;
      }

      const response = await api.post<{ data: Attendance }>(BASE_PATH, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAttendance() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AttendanceFormBody> }) => {
      const payload: Record<string, unknown> = {};

      if (data.date !== undefined) payload.date = data.date;
      if (data.checkin !== undefined) payload.checkin = data.checkin;
      if (data.checkout !== undefined) payload.checkout = data.checkout;
      if (data.note !== undefined) payload.note = data.note;

      const response = await api.put<{ data: Attendance }>(`${BASE_PATH}/${id}`, payload);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAttendance() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkMarkPresentAttendances() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ marked_count: number }>(
        `${BASE_PATH}/bulk-mark-present`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkMarkLateAttendances() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ marked_count: number }>(
        `${BASE_PATH}/bulk-mark-late`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyAttendances() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAttendancesImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const response = await api.post(`${BASE_PATH}/import`, form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAttendancesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: AttendanceExportParams) => {
      if (params.method === 'download') {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendances-export-${Date.now()}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { message: "Export downloaded successfully" };
      }

      const response = await api.post(`${BASE_PATH}/export`, params);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAttendancesTemplateDownload() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendances-sample.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { message: "Sample template downloaded" };
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}