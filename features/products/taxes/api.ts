"use client";

/**
 * Taxes API Hooks
 *
 * Client-side hooks for managing Tax entities using TanStack Query.
 * Integrates with the application's authenticated API client to handle
 * CRUD operations, validation, and cache management.
 *
 * @module features/taxes/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tax, TaxFormData } from "./types";

/**
 * Tax query keys.
 * Centralized key factory to ensure consistency in caching and invalidation.
 */
export const taxKeys = {
  /** Root key for all tax-related queries. */
  all: ["taxes"] as const,

  /** Base key for tax list queries. */
  lists: () => [...taxKeys.all, "list"] as const,

  /**
   * Generates a specific list key with filters.
   * @param {Record<string, unknown>} [filters] - Search, pagination, and status filters.
   */
  list: (filters?: Record<string, unknown>) =>
    [...taxKeys.lists(), filters] as const,

  /** Base key for single tax detail queries. */
  details: () => [...taxKeys.all, "detail"] as const,

  /**
   * Generates a specific key for a single tax record.
   * @param {number} id - The unique identifier of the tax.
   */
  detail: (id: number) => [...taxKeys.details(), id] as const,
};

/**
 * useTaxes
 *
 * Fetches a paginated list of taxes from the API.
 * Automatically pauses execution until the user session is fully authenticated.
 *
 * @param {Object} [params] - Filtering and pagination parameters.
 * @param {number} [params.page] - Current page number.
 * @param {number} [params.per_page] - Number of items per page.
 * @param {string} [params.search] - Search query string.
 * @param {boolean} [params.is_active] - Filter by active status.
 * @returns {Object} Query result including `isSessionLoading` status.
 */
export function useTaxes(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}) {
  const { api, sessionStatus } = useApiClient();

  const query = useQuery({
    queryKey: taxKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Tax[]>("/taxes", { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });

  return {
    ...query,
    /** Indicates whether NextAuth session is still loading. */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * useTax
 *
 * Fetches details for a single tax record by ID.
 *
 * @param {number} id - The unique identifier of the tax to fetch.
 * @returns {Object} Query result containing the Tax object or null.
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
    /** Indicates whether NextAuth session is still loading. */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * useCreateTax
 *
 * Mutation hook to create a new tax record.
 * Handles API submission, validation errors, and cache invalidation.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useCreateTax() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaxFormData) => {
      const response = await api.post<Tax>("/taxes", {
        name: data.name,
        rate: data.rate,
        is_active: data.is_active,
        woocommerce_tax_id: data.woocommerce_tax_id ?? undefined,
      });

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
      toast.error(
        error instanceof Error ? error.message : "Failed to create tax"
      );
    },
  });
}

/**
 * useUpdateTax
 *
 * Mutation hook to update an existing tax record.
 * Supports partial updates by only sending defined fields in the payload.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useUpdateTax() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TaxFormData>;
    }) => {
      const payload: Record<string, unknown> = {};

      if (data.name !== undefined) payload.name = data.name;
      if (data.rate !== undefined) payload.rate = data.rate;
      if (data.is_active !== undefined) payload.is_active = data.is_active;
      if (data.woocommerce_tax_id !== undefined)
        payload.woocommerce_tax_id = data.woocommerce_tax_id ?? null;

      const response = await api.patch<Tax>(`/taxes/${id}`, payload);

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
      queryClient.invalidateQueries({
        queryKey: taxKeys.detail(variables.id),
      });
      toast.success("Tax updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update tax"
      );
    },
  });
}

/**
 * useDeleteTax
 *
 * Mutation hook to permanently delete a tax record.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
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
      toast.error(
        error instanceof Error ? error.message : "Failed to delete tax"
      );
    },
  });
}