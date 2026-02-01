"use client";

/**
 * Units API Hooks
 *
 * Client-side hooks for managing Unit entities using TanStack Query.
 * Handles fetching lists, hierarchical base units, CRUD operations,
 * and cache invalidation strategies.
 *
 * @module features/units/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Unit, UnitFormData } from "./types";

/**
 * Unit query keys.
 * Centralized key factory for type-safe cache management.
 */
export const unitKeys = {
  /** Root key for all unit-related queries. */
  all: ["units"] as const,

  /** Base key for unit list queries. */
  lists: () => [...unitKeys.all, "list"] as const,

  /**
   * Generates a specific list key with filters.
   * @param {Record<string, unknown>} [filters] - Search, pagination, and status filters.
   */
  list: (filters?: Record<string, unknown>) =>
    [...unitKeys.lists(), filters] as const,

  /** Base key for single unit detail queries. */
  details: () => [...unitKeys.all, "detail"] as const,

  /**
   * Generates a specific key for a single unit record.
   * @param {number} id - The unique identifier of the unit.
   */
  detail: (id: number) => [...unitKeys.details(), id] as const,

  /** Key for fetching base units (used in dropdowns for sub-units). */
  baseUnits: () => [...unitKeys.all, "base-units"] as const,
};

/**
 * useUnits
 *
 * Fetches a paginated list of units from the API.
 * 
 *
 * @param {Object} [params] - Filtering and pagination parameters.
 * @param {number} [params.page] - Current page number.
 * @param {number} [params.per_page] - Number of items per page.
 * @param {string} [params.search] - Search query string.
 * @param {boolean} [params.is_active] - Filter by active status.
 * @returns {Object} Query result including `isSessionLoading` status.
 */
export function useUnits(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: unitKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Unit[]>("/units", { params });
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
 * useBaseUnits
 *
 * Fetches a list of base units (units that are not sub-units of others).
 * Primarily used to populate parent unit dropdowns in forms.
 *
 * @returns {UseQueryResult<Unit[]>} Query result containing the list of base units.
 */
export function useBaseUnits() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: unitKeys.baseUnits(),
    queryFn: async () => {
      const response = await api.get<Unit[]>("/units/base-units");
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
}

/**
 * useUnit
 *
 * Fetches details for a single unit record by ID.
 *
 * @param {number} id - The unique identifier of the unit to fetch.
 * @returns {Object} Query result containing the Unit object or null.
 */
export function useUnit(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Unit>(`/units/${id}`);
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
 * useCreateUnit
 *
 * Mutation hook to create a new unit record.
 * Handles payload construction, validation errors, and invalidates relevant caches.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useCreateUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UnitFormData) => {
      const payload: Record<string, unknown> = {
        code: data.code,
        name: data.name,
        is_active: data.is_active ?? true,
      };
      if (data.base_unit != null) payload.base_unit = data.base_unit;
      if (data.operator != null) payload.operator = data.operator;
      if (data.operation_value != null)
        payload.operation_value = data.operation_value;

      const response = await api.post<Unit>("/units", payload);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.baseUnits() });
      toast.success("Unit created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create unit"
      );
    },
  });
}

/**
 * useUpdateUnit
 *
 * Mutation hook to update an existing unit record.
 * Supports partial updates and ensures base unit relationships are handled correctly.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useUpdateUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<UnitFormData>;
    }) => {
      const payload: Record<string, unknown> = {};
      if (data.code !== undefined) payload.code = data.code;
      if (data.name !== undefined) payload.name = data.name;
      if (data.base_unit !== undefined)
        payload.base_unit = data.base_unit ?? null;
      if (data.operator !== undefined) payload.operator = data.operator ?? null;
      if (data.operation_value !== undefined)
        payload.operation_value = data.operation_value ?? null;
      if (data.is_active !== undefined) payload.is_active = data.is_active;

      const response = await api.patch<Unit>(`/units/${id}`, payload);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: unitKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: unitKeys.baseUnits() });
      toast.success("Unit updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update unit"
      );
    },
  });
}

/**
 * useDeleteUnit
 *
 * Mutation hook to permanently delete a unit record.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useDeleteUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/units/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.baseUnits() });
      toast.success("Unit deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete unit"
      );
    },
  });
}