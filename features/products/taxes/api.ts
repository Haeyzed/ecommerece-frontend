"use client";

/**
 * =====================================================
 * Taxes API Hooks
 * -----------------------------------------------------
 * Client-side hooks for managing Taxes using:
 * - TanStack Query (server-state management)
 * - NextAuth-aware API client
 * - Laravel-compatible API responses
 * - Sonner for user feedback (toasts)
 *
 * Responsibilities:
 * - Fetch tax lists and single tax records
 * - Create, update, and delete taxes
 * - Handle validation and API errors
 * - Keep query cache in sync via invalidation
 * =====================================================
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tax, TaxFormData } from "./types";

/**
 * Tax query key factory.
 *
 * Used to generate consistent, type-safe cache keys
 * for TanStack Query.
 */
export const taxKeys = {
  /** Root key for all tax-related queries */
  all: ["taxes"] as const,

  /** Base key for tax list queries */
  lists: () => [...taxKeys.all, "list"] as const,

  /**
   * Tax list key with optional filters
   *
   * @param filters - Pagination, search, and status filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...taxKeys.lists(), filters] as const,

  /** Base key for single tax queries */
  details: () => [...taxKeys.all, "detail"] as const,

  /**
   * Single tax query key
   *
   * @param id - Tax ID
   */
  detail: (id: number) => [...taxKeys.details(), id] as const,
};

/**
 * Fetch paginated list of taxes.
 *
 * Supported query params:
 * - page
 * - per_page
 * - search
 * - is_active
 *
 * Automatically waits for session hydration
 * before executing the request.
 *
 * @param params - Pagination and filter options
 * @returns TanStack Query result with extra `isSessionLoading` flag
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
    /** Indicates whether NextAuth session is still loading */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * Fetch a single tax by ID.
 *
 * Automatically disabled when:
 * - ID is falsy
 * - Session is still loading
 *
 * @param id - Tax ID
 * @returns TanStack Query result with `Tax | null`
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
 * Create a new tax.
 *
 * Side effects:
 * - Invalidates tax list queries
 * - Displays success or error toast
 *
 * @returns TanStack mutation object
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
 * Update an existing tax.
 *
 * - Builds a partial payload dynamically
 * - Invalidates both list and detail queries
 *
 * @returns TanStack mutation object
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
 * Delete a tax by ID.
 *
 * Side effects:
 * - Invalidates tax list cache
 * - Displays toast feedback
 *
 * @returns TanStack mutation object
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
