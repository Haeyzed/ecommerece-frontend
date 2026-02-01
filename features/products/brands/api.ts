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
import type { Brand, BrandFormData } from "./types";

/**
 * Brand query key factory.
 * Generates consistent, type-safe cache keys for TanStack Query.
 */
export const brandKeys = {
  /** Root key for all brand-related queries */
  all: ["brands"] as const,

  /** Base key for brand list queries */
  lists: () => [...brandKeys.all, "list"] as const,

  /**
   * Brand list key with optional filters
   * @param {Record<string, unknown>} [filters] - Pagination, search, and status filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...brandKeys.lists(), filters] as const,

  /** Base key for single brand queries */
  details: () => [...brandKeys.all, "detail"] as const,

  /**
   * Single brand query key
   * @param {number} id - Brand ID
   */
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

/**
 * useBrands
 *
 * Fetches a paginated list of brands with optional filtering.
 * Automatically pauses until the user session is authenticated.
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.per_page] - Items per page
 * @param {string} [params.search] - Search term
 * @param {boolean} [params.is_active] - Filter by active status
 * @returns {Object} TanStack Query result including `isSessionLoading` flag
 */
export function useBrands(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
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
    /** Indicates whether NextAuth session is still loading */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * useBrand
 *
 * Fetches details for a single brand by ID.
 *
 * @param {number} id - The ID of the brand to fetch
 * @returns {Object} TanStack Query result containing the Brand object or null
 */
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
    /** Indicates whether NextAuth session is still loading */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * useCreateBrand
 *
 * Mutation hook to create a new brand.
 * Handles FormData conversion for file uploads.
 *
 * @returns {Object} TanStack Mutation result
 */
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

/**
 * useUpdateBrand
 *
 * Mutation hook to update an existing brand.
 * Uses POST with `_method=PUT` to handle file uploads in Laravel.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useUpdateBrand() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BrandFormData> }) => {
      const formData = new FormData();
      
      // Laravel convention: use POST with _method=PUT for file uploads
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

/**
 * useDeleteBrand
 *
 * Mutation hook to delete a single brand by ID.
 *
 * @returns {Object} TanStack Mutation result
 */
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

/**
 * useBulkActivateBrands
 *
 * Mutation hook to bulk activate multiple brands.
 *
 * @returns {Object} TanStack Mutation result
 */
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

/**
 * useBulkDeactivateBrands
 *
 * Mutation hook to bulk deactivate multiple brands.
 *
 * @returns {Object} TanStack Mutation result
 */
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

/**
 * useBulkDestroyBrands
 *
 * Mutation hook to permanently delete multiple brands.
 *
 * @returns {Object} TanStack Mutation result
 */
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

/**
 * useBrandsImport
 *
 * Mutation hook to import brands from a file (CSV/Excel).
 *
 * @returns {Object} TanStack Mutation result
 */
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