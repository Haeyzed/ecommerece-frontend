"use client";

/**
 * Taxes API Hooks
 *
 * Client-side hooks for managing Taxes using TanStack Query and a NextAuth-aware API client.
 * Handles CRUD operations, bulk actions, and file imports with automatic cache invalidation.
 *
 * @module features/settings/taxes/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tax, TaxFormData } from "./types";

/**
 * Tax query key factory.
 * Generates consistent, type-safe cache keys for TanStack Query.
 */
export const taxKeys = {
  /** Root key for all tax-related queries */
  all: ["taxes"] as const,

  /** Base key for tax list queries */
  lists: () => [...taxKeys.all, "list"] as const,

  /**
   * Tax list key with optional filters
   * @param {Record<string, unknown>} [filters] - Pagination, search, and status filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...taxKeys.lists(), filters] as const,

  /** Base key for single tax queries */
  details: () => [...taxKeys.all, "detail"] as const,

  /**
   * Single tax query key
   * @param {number} id - Tax ID
   */
  detail: (id: number) => [...taxKeys.details(), id] as const,
};

/**
 * useTaxes
 *
 * Fetches a paginated list of taxes with optional filtering.
 * Automatically pauses until the user session is authenticated.
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.per_page] - Items per page
 * @param {string} [params.search] - Search term
 * @param {string} [params.status] - Filter by active status
 * @returns {Object} TanStack Query result including `isSessionLoading` flag
 */
export function useTaxes(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: taxKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Tax[]>(
        "/taxes",
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
 * useTax
 *
 * Fetches details for a single tax by ID.
 *
 * @param {number} id - The ID of the tax to fetch
 * @returns {Object} TanStack Query result containing the Tax object or null
 */
export function useTax(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: taxKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Tax>(`/taxes/${id}`);
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
 * useCreateTax
 *
 * Mutation hook to create a new tax.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useCreateTax() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaxFormData) => {
      const formData = new FormData();
      
      formData.append("name", data.name);
      formData.append("rate", data.rate.toString());
      if (data.woocommerce_tax_id) formData.append("woocommerce_tax_id", data.woocommerce_tax_id.toString());
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");
      const response = await api.post<{ data: Tax }>("/taxes", formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Tax created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create tax");
    },
  });
}

/**
 * useUpdateTax
 *
 * Mutation hook to update an existing tax.
 * Uses POST with `_method=PUT` to maintain Laravel convention.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useUpdateTax() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TaxFormData> }) => {
      const formData = new FormData();
      
      // Laravel convention: use POST with _method=PUT
      formData.append("_method", "PUT");
      
      if (data.name) formData.append("name", data.name);
      if (data.rate !== undefined) formData.append("rate", data.rate.toString());
      if (data.woocommerce_tax_id !== undefined) formData.append("woocommerce_tax_id", data.woocommerce_tax_id ? data.woocommerce_tax_id.toString() : "");
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Tax }>(`/taxes/${id}`, formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxKeys.detail(variables.id) });
      toast.success("Tax updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update tax");
    },
  });
}

/**
 * useDeleteTax
 *
 * Mutation hook to delete a single tax by ID.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useDeleteTax() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/taxes/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Tax deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete tax");
    },
  });
}

/**
 * useBulkActivateTaxes
 *
 * Mutation hook to bulk activate multiple taxes.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkActivateTaxes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        "/taxes/bulk-activate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Taxes activated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to activate"),
  });
}

/**
 * useBulkDeactivateTaxes
 *
 * Mutation hook to bulk deactivate multiple taxes.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDeactivateTaxes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        "/taxes/bulk-deactivate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Taxes deactivated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to deactivate"),
  });
}

/**
 * useBulkDestroyTaxes
 *
 * Mutation hook to permanently delete multiple taxes.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDestroyTaxes() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/taxes/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Taxes deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}

/**
 * useTaxesImport
 *
 * Mutation hook to import taxes from a file (CSV/Excel).
 *
 * @returns {Object} TanStack Mutation result
 */
export function useTaxesImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/taxes/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Taxes imported");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}