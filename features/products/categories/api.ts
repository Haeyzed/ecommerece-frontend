"use client";

/**
 * Categories API Hooks
 *
 * Client-side hooks for managing Categories using TanStack Query and a NextAuth-aware API client.
 * Handles CRUD operations, bulk actions, and file imports with automatic cache invalidation.
 *
 * @module features/categories/api
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api/api-client-client";
import type { Category, CategoryFormData, CategoryOption } from "./types";
import type { PaginationMeta } from "@/lib/api/api-types";
import { ValidationError } from "@/lib/api/api-errors";
import { toast } from "sonner";

/**
 * Category query key factory.
 * Generates consistent, type-safe cache keys for TanStack Query.
 */
export const categoryKeys = {
  /** Root key for all category-related queries */
  all: ["categories"] as const,

  /** Base key for category list queries */
  lists: () => [...categoryKeys.all, "list"] as const,

  /**
   * Category list key with optional filters
   * @param {Record<string, unknown>} [filters] - Pagination, search, and filter options
   */
  list: (filters?: Record<string, unknown>) =>
    [...categoryKeys.lists(), filters] as const,

  /** Base key for single category queries */
  details: () => [...categoryKeys.all, "detail"] as const,

  /**
   * Single category query key
   * @param {number} id - Category ID
   */
  detail: (id: number) => [...categoryKeys.details(), id] as const,

  /** Key for parent category options */
  parents: () => [...categoryKeys.all, "parents"] as const,
};

/**
 * useCategories
 *
 * Fetches a paginated list of categories with optional filtering.
 * Automatically pauses until the user session is authenticated.
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.per_page] - Items per page
 * @param {string} [params.search] - Search term
 * @param {string} [params.status] - Filter by active status
 * @param {string} [params.featured_status] - Filter by featured status
 * @param {string} [params.sync_status] - Filter by sync status
 * @param {number|null} [params.parent_id] - Filter by parent category
 * @returns {Object} TanStack Query result including `isSessionLoading` flag
 */
export function useCategories(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  featured_status?: string;
  sync_status?: string;
  parent_id?: number | null;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Category[]>(
        "/categories",
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
 * useParentCategories
 *
 * Fetches a list of simplified category options (value/label) suitable for
 * parent category selection in forms.
 *
 * @returns {Object} TanStack Query result containing CategoryOption array
 */
export function useParentCategories() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: categoryKeys.parents(),
    queryFn: async () => {
      const response = await api.get<CategoryOption[]>("/categories/parents");
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

/**
 * useCategory
 *
 * Fetches details for a single category by ID.
 *
 * @param {number} id - The ID of the category to fetch
 * @returns {Object} TanStack Query result containing the Category object or null
 */
export function useCategory(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Category>(`/categories/${id}`);
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
 * useCreateCategory
 *
 * Mutation hook to create a new category.
 * Handles FormData conversion for file uploads.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useCreateCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const formData = new FormData();
      
      // Add all fields to FormData
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

      const response = await api.post<{ data: Category }>("/categories", formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    },
  });
}

/**
 * useUpdateCategory
 *
 * Mutation hook to update an existing category.
 * Uses POST with `_method=PUT` to handle file uploads in Laravel.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useUpdateCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryFormData> }) => {
      const formData = new FormData();
      
      // Laravel convention: use POST with _method=PUT for file uploads
      formData.append("_method", "PUT");
      // Add all fields to FormData
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

      const response = await api.post<{ data: Category }>(`/categories/${id}`, formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    },
  });
}

/**
 * useDeleteCategory
 *
 * Mutation hook to delete a single category by ID.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useDeleteCategory() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/categories/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    },
  });
}

/**
 * useBulkActivateCategories
 *
 * Mutation hook to bulk activate multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkActivateCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        "/categories/bulk-activate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categories activated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to activate"),
  });
}

/**
 * useBulkDeactivateCategories
 *
 * Mutation hook to bulk deactivate multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDeactivateCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        "/categories/bulk-deactivate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categories deactivated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to deactivate"),
  });
}

/**
 * useBulkEnableFeaturedCategories
 *
 * Mutation hook to mark multiple categories as featured.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkEnableFeaturedCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        "/categories/bulk-enable-featured",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categories featured");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update"),
  });
}

/**
 * useBulkDisableFeaturedCategories
 *
 * Mutation hook to remove the featured flag from multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDisableFeaturedCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        "/categories/bulk-disable-featured",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categories unfeatured");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update"),
  });
}

/**
 * useBulkEnableSyncCategories
 *
 * Mutation hook to enable synchronization for multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkEnableSyncCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        "/categories/bulk-enable-sync",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Sync enabled");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update"),
  });
}

/**
 * useBulkDisableSyncCategories
 *
 * Mutation hook to disable synchronization for multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDisableSyncCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ updated_count: number }>(
        "/categories/bulk-disable-sync",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Sync disabled");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update"),
  });
}

/**
 * useBulkDestroyCategories
 *
 * Mutation hook to permanently delete multiple categories.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDestroyCategories() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/categories/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
      toast.success("Categories deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}

/**
 * useCategoriesImport
 *
 * Mutation hook to import categories from a file (CSV/Excel).
 *
 * @returns {Object} TanStack Mutation result
 */
export function useCategoriesImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/categories/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.parents() });
      toast.success("Categories imported");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}