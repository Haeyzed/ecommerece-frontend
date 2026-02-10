"use client";

/**
 * Customer Groups API Hooks
 *
 * Client-side hooks for managing Customer Groups using TanStack Query and a NextAuth-aware API client.
 * Handles CRUD operations, bulk actions, and file imports with automatic cache invalidation.
 *
 * @module features/settings/customer-groups/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CustomerGroupFormData } from "./schemas";
import type { CustomerGroup } from "./types";

/**
 * Customer group query key factory.
 * Generates consistent, type-safe cache keys for TanStack Query.
 */
export const customerGroupKeys = {
  /** Root key for all customer-group-related queries */
  all: ["customer-groups"] as const,

  /** Base key for customer group list queries */
  lists: () => [...customerGroupKeys.all, "list"] as const,

  /**
   * Customer group list key with optional filters
   * @param {Record<string, unknown>} [filters] - Pagination, search, and is_active filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...customerGroupKeys.lists(), filters] as const,

  /** Base key for single customer group queries */
  details: () => [...customerGroupKeys.all, "detail"] as const,

  /**
   * Single customer group query key
   * @param {number} id - Customer group ID
   */
  detail: (id: number) => [...customerGroupKeys.details(), id] as const,
};

/**
 * useCustomerGroups
 *
 * Fetches a paginated list of customer groups with optional filtering.
 * Automatically pauses until the user session is authenticated.
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.per_page] - Items per page
 * @param {string} [params.search] - Search term
 * @param {boolean} [params.is_active] - Filter by active status
 * @returns {Object} TanStack Query result including `isSessionLoading` flag
 */
export function useCustomerGroups(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: customerGroupKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CustomerGroup[]>("/customer-groups", {
        params,
      });
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
 * useCustomerGroup
 *
 * Fetches details for a single customer group by ID.
 *
 * @param {number} id - The ID of the customer group to fetch
 * @returns {Object} TanStack Query result containing the CustomerGroup object or null
 */
export function useCustomerGroup(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: customerGroupKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CustomerGroup>(`/customer-groups/${id}`);
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
 * useCreateCustomerGroup
 *
 * Mutation hook to create a new customer group.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useCreateCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerGroupFormData) => {
      const payload = {
        name: data.name,
        percentage: data.percentage ?? 0,
        is_active: data.is_active ?? true,
      };
      const response = await api.post<CustomerGroup>("/customer-groups", payload);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer group created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create customer group"
      );
    },
  });
}

/**
 * useUpdateCustomerGroup
 *
 * Mutation hook to update an existing customer group.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useUpdateCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CustomerGroupFormData>;
    }) => {
      const payload = {
        name: data.name,
        percentage: data.percentage,
        is_active: data.is_active,
      };
      const response = await api.put<CustomerGroup>(
        `/customer-groups/${id}`,
        payload
      );
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerGroupKeys.detail(variables.id),
      });
      toast.success("Customer group updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update customer group"
      );
    },
  });
}

/**
 * useDeleteCustomerGroup
 *
 * Mutation hook to delete a single customer group by ID.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useDeleteCustomerGroup() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/customer-groups/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer group deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete customer group"
      );
    },
  });
}

/**
 * useBulkDestroyCustomerGroups
 *
 * Mutation hook to permanently delete multiple customer groups.
 *
 * @returns {Object} TanStack Mutation result
 */
export function useBulkDestroyCustomerGroups() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/customer-groups/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer groups deleted");
    },
    onError: (e) =>
      toast.error(
        e instanceof Error ? e.message : "Failed to delete customer groups"
      ),
  });
}

/**
 * useCustomerGroupsImport
 *
 * Mutation hook to import customer groups from a file (CSV/Excel).
 *
 * @returns {Object} TanStack Mutation result
 */
export function useCustomerGroupsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/customer-groups/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer groups imported");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}
