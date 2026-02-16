"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Biller, BillerExportParams, BillerFormData, BillerListParams, BillerOption } from "./types";

export const billerKeys = {
  all: ["billers"] as const,
  lists: () => [...billerKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...billerKeys.lists(), filters] as const,
  details: () => [...billerKeys.all, "detail"] as const,
  detail: (id: number) => [...billerKeys.details(), id] as const,
  options: () => [...billerKeys.all, "options"] as const,
  template: () => [...billerKeys.all, "template"] as const,
};

const BASE_PATH = '/billers'

export function useBillers(params?: BillerListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: billerKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Biller[]>(
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

export function useOptionBillers() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: billerKeys.options(),
    queryFn: async () => {
      const response = await api.get<BillerOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useBiller(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: billerKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Biller>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useCreateBiller() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BillerFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("company_name", data.company_name);
      if (data.vat_number) formData.append("vat_number", data.vat_number);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("address", data.address);
      formData.append("city", data.city);
      if (data.state) formData.append("state", data.state);
      if (data.postal_code) formData.append("postal_code", data.postal_code);
      if (data.country) formData.append("country", data.country);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Biller }>(BASE_PATH, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBiller() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BillerFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.company_name) formData.append("company_name", data.company_name);
      if (data.vat_number !== undefined) formData.append("vat_number", data.vat_number ?? "");
      if (data.email) formData.append("email", data.email);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);
      if (data.city) formData.append("city", data.city);
      if (data.state !== undefined) formData.append("state", data.state ?? "");
      if (data.postal_code !== undefined) formData.append("postal_code", data.postal_code ?? "");
      if (data.country !== undefined) formData.append("country", data.country ?? "");
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Biller }>(`${BASE_PATH}/${id}`, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: billerKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteBiller() {
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
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateBillers() {
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
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateBillers() {
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
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyBillers() {
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
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBillersImport() {
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
      queryClient.invalidateQueries({ queryKey: billerKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBillersExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: BillerExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `billers-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
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

export function useBillersTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `billers-sample.csv`;
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