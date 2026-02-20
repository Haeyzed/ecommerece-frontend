"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Department, DepartmentExportParams, DepartmentFormData, DepartmentListParams, DepartmentOption } from './types'

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...departmentKeys.lists(), filters] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
  options: () => [...departmentKeys.all, "options"] as const,
  template: () => [...departmentKeys.all, "template"] as const,
};

const BASE_PATH = '/departments'

export function useDepartments(params?: DepartmentListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Department[]>(
        BASE_PATH,
        { params }
      );
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionDepartments() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: departmentKeys.options(),
    queryFn: async () => {
      const response = await api.get<DepartmentOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useDepartment(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Department>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useCreateDepartment() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DepartmentFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Department }>(BASE_PATH, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateDepartment() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DepartmentFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Department }>(`${BASE_PATH}/${id}`, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteDepartment() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateDepartments() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateDepartments() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyDepartments() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete(`${BASE_PATH}/bulk-destroy`, {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDepartmentsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post(`${BASE_PATH}/import`, form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDepartmentsExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: DepartmentExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `departments-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
        link.download = fileName;
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

export function useDepartmentsTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `departments-sample.csv`;
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