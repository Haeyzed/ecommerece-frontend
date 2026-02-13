"use client";

/**
 * Brands API Hooks
 *
 * Client-side hooks for managing Brands using TanStack Query and a NextAuth-aware API client.
 * Handles CRUD operations, bulk actions, and file imports with automatic cache invalidation.
 *
 * @module features/brands/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Brand, BrandExportParams, BrandFormData } from "./types";

export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

export function useBrands(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: brandKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Brand[]>(
        "/brands",
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

export function useBrand(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Brand>(`/brands/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useCreateBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BrandFormData) => {
      const formData = new FormData();
      
      formData.append("name", data.name);
      if (data.slug) formData.append("slug", data.slug);
      if (data.short_description) formData.append("short_description", data.short_description);
      if (data.page_title) formData.append("page_title", data.page_title);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Brand }>("/brands", formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brand created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create brand");
    },
  });
}

export function useUpdateBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BrandFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      if (data.name) formData.append("name", data.name);
      if (data.slug !== undefined) formData.append("slug", data.slug || "");
      if (data.short_description !== undefined) formData.append("short_description", data.short_description || "");
      if (data.page_title !== undefined) formData.append("page_title", data.page_title || "");
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");
      const response = await api.post<{ data: Brand }>(`/brands/${id}`, formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.id) });
      toast.success("Brand updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update brand");
    },
  });
}

export function useDeleteBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/brands/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brand deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete brand");
    },
  });
}

export function useBulkActivateBrands() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        "/brands/bulk-activate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brands activated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to activate"),
  });
}

export function useBulkDeactivateBrands() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        "/brands/bulk-deactivate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brands deactivated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to deactivate"),
  });
}

export function useBulkDestroyBrands() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/brands/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brands deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}

export function useBrandsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/brands/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success("Brands imported");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}

export function useBrandsExport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BrandExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob("/brands/export", params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `brands-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { message: "Export downloaded successfully" };
      }

      const response = await api.post("/brands/export", params);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (_, variables) => {
      if (variables.method === "email") {
        toast.success("Export sent via email successfully");
      } else {
        toast.success("Export downloaded successfully");
      }
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Export failed"),
  });
}