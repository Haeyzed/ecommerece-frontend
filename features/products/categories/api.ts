'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Category,
  CategoryExportParams,
  CategoryFormData,
  CategoryListParams,
  CategoryOption,
} from './types';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  options: () => [...categoryKeys.all, 'options'] as const,
  template: () => [...categoryKeys.all, 'template'] as const,
};

const BASE_PATH = '/categories';

export function useCategories(params?: CategoryListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Category[]>(
        BASE_PATH,
        { params }
      );
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionCategories() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: categoryKeys.options(),
    queryFn: async () => {
      const response = await api.get<CategoryOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useCategory(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Category>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.slug) formData.append("slug", data.slug);
      if (data.short_description) formData.append("short_description", data.short_description);
      if (data.page_title) formData.append("page_title", data.page_title);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.icon && data.icon.length > 0) {
        formData.append("icon", data.icon[0]);
      }
      if (data.parent_id) formData.append("parent_id", data.parent_id.toString());
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");
      if (data.featured !== undefined) formData.append("featured", data.featured ? "1" : "0");
      if (data.is_sync_disable !== undefined) formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0");
      if (data.woocommerce_category_id) formData.append("woocommerce_category_id", data.woocommerce_category_id.toString());

      const response = await api.post<{ data: Category }>(BASE_PATH, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.slug !== undefined) formData.append("slug", data.slug || "");
      if (data.short_description !== undefined) formData.append("short_description", data.short_description || "");
      if (data.page_title !== undefined) formData.append("page_title", data.page_title || "");
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.icon && data.icon.length > 0) {
        formData.append("icon", data.icon[0]);
      }
      if (data.parent_id !== undefined) formData.append("parent_id", data.parent_id?.toString() || "");
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");
      if (data.featured !== undefined) formData.append("featured", data.featured ? "1" : "0");
      if (data.is_sync_disable !== undefined) formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0");
      if (data.woocommerce_category_id !== undefined) formData.append("woocommerce_category_id", data.woocommerce_category_id?.toString() || "");

      const response = await api.post<{ data: Category }>(`${BASE_PATH}/${id}`, formData);
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useReparentCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      parent_id,
    }: {
      id: number;
      parent_id: number | null;
    }) => {
      const response = await api.patch<{ data: Category }>(
        `${BASE_PATH}/${id}/reparent`,
        { parent_id }
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkActivateCategories() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateCategories() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkEnableFeaturedCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        `${BASE_PATH}/bulk-enable-featured`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDisableFeaturedCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        `${BASE_PATH}/bulk-disable-featured`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkEnableSyncCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        `${BASE_PATH}/bulk-enable-sync`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDisableSyncCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        `${BASE_PATH}/bulk-disable-sync`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCategoriesImport() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCategoriesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: CategoryExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `categories-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
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

export function useCategoriesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `categories-sample.csv`;
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