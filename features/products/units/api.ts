"use client";

/**
 * =====================================================
 * Units API Hooks
 * -----------------------------------------------------
 * Client-side hooks for managing Units using:
 * - TanStack Query (server-state management)
 * - NextAuth-aware API client
 * - Laravel-compatible API responses
 * - Sonner for user feedback (toasts)
 *
 * Responsibilities:
 * - Fetch unit lists, single units, and base units
 * - Create, update, and delete units
 * - Handle validation and API errors
 * - Keep query cache in sync via invalidation
 * =====================================================
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api/api-client-client";
import type { Unit, UnitFormData } from "./types";
import type { PaginationMeta } from "@/lib/api/api-types";
import { ValidationError } from "@/lib/api/api-errors";
import { toast } from "sonner";

/**
 * Unit query key factory.
 *
 * Used to generate consistent, type-safe cache keys
 * for TanStack Query.
 */
export const unitKeys = {
  /** Root key for all unit-related queries */
  all: ["units"] as const,

  /** Base key for unit list queries */
  lists: () => [...unitKeys.all, "list"] as const,

  /**
   * Unit list key with optional filters
   *
   * @param filters - Pagination, search, and status filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...unitKeys.lists(), filters] as const,

  /** Base key for single unit queries */
  details: () => [...unitKeys.all, "detail"] as const,

  /**
   * Single unit query key
   *
   * @param id - Unit ID
   */
  detail: (id: number) => [...unitKeys.details(), id] as const,

  /** Key for base-units list (e.g. dropdown / sub-unit form) */
  baseUnits: () => [...unitKeys.all, "base-units"] as const,
};

/**
 * Fetch paginated list of units.
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
    /** Indicates whether NextAuth session is still loading */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * Fetch base units only (for dropdown / sub-unit form).
 *
 * GET /units/base-units
 *
 * Automatically disabled when session is still loading.
 *
 * @returns TanStack Query result with unit list
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
 * Fetch a single unit by ID.
 *
 * Automatically disabled when:
 * - ID is falsy
 * - Session is still loading
 *
 * @param id - Unit ID
 * @returns TanStack Query result with `Unit | null`
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
    /** Indicates whether NextAuth session is still loading */
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * Create a new unit.
 *
 * Side effects:
 * - Invalidates unit list and base-units queries
 * - Displays success or error toast
 *
 * @returns TanStack mutation object
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
      if (data.operation_value != null) payload.operation_value = data.operation_value;

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
      toast.error(error instanceof Error ? error.message : "Failed to create unit");
    },
  });
}

export function useUpdateUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UnitFormData> }) => {
      const payload: Record<string, unknown> = {};
      if (data.code !== undefined) payload.code = data.code;
      if (data.name !== undefined) payload.name = data.name;
      if (data.base_unit !== undefined) payload.base_unit = data.base_unit ?? null;
      if (data.operator !== undefined) payload.operator = data.operator ?? null;
      if (data.operation_value !== undefined) payload.operation_value = data.operation_value ?? null;
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
      queryClient.invalidateQueries({ queryKey: unitKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: unitKeys.baseUnits() });
      toast.success("Unit updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update unit");
    },
  });
}

/**
 * Delete a unit by ID.
 *
 * Side effects:
 * - Invalidates unit list and base-units cache
 * - Displays toast feedback
 *
 * @returns TanStack mutation object
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
      toast.error(error instanceof Error ? error.message : "Failed to delete unit");
    },
  });
}
