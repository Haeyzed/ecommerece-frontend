"use client";

/**
 * Units API Hooks
 *
 * Client-side hooks for managing Units using TanStack Query and a NextAuth-aware API client.
 * Handles CRUD operations, bulk actions, and file imports with automatic cache invalidation.
 *
 * @module features/products/units/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Unit, UnitFormData, UnitOption } from "./types";

/**
 * Unit query key factory.
 * Generates consistent, type-safe cache keys for TanStack Query.
 */
export const unitKeys = {
  /** Root key for all unit-related queries */
  all: ["units"] as const,

  /** Base key for unit list queries */
  lists: () => [...unitKeys.all, "list"] as const,

  /**
   * Unit list key with optional filters
   * @param {Record<string, unknown>} [filters] - Pagination, search, and status filters
   */
  list: (filters?: Record<string, unknown>) =>
    [...unitKeys.lists(), filters] as const,

  /** Base key for single unit queries */
  details: () => [...unitKeys.all, "detail"] as const,

  /**
   * Single unit query key
   * @param {number} id - Unit ID
   */
  detail: (id: number) => [...unitKeys.details(), id] as const,

  /** Key for base units list (combobox options) */
  baseUnits: () => [...unitKeys.all, "base-units"] as const,
};

/**
 * useUnits
 *
 * Fetches a paginated list of units with optional filtering.
 */
export function useUnits(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: unitKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Unit[]>(
        "/units",
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

/**
 * useUnit
 *
 * Fetches details for a single unit by ID.
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
    isSessionLoading: sessionStatus === "loading",
  };
}

/**
 * useBaseUnits
 *
 * Fetches a lightweight list of units suitable for the Base Unit combobox.
 */
export function useBaseUnits() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: unitKeys.baseUnits(),
    queryFn: async () => {
      const response = await api.get<UnitOption[]>("/units/base-units");
      return response.data || [];
    },
    enabled: sessionStatus !== "loading",
  });
}

/**
 * useCreateUnit
 *
 * Mutation hook to create a new unit.
 */
export function useCreateUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UnitFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("code", data.code);
      if (data.base_unit !== undefined) {
        formData.append("base_unit", data.base_unit ? data.base_unit.toString() : "");
        if (data.operator !== undefined) formData.append("operator", data.operator || "");
        if (data.operation_value !== undefined) formData.append("operation_value", data.operation_value ? data.operation_value.toString() : "");
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Unit }>("/units", formData);
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
      toast.success("Unit created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create unit");
    },
  });
}

/**
 * useUpdateUnit
 *
 * Mutation hook to update an existing unit.
 */
export function useUpdateUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UnitFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.code) formData.append("code", data.code);
      if (data.base_unit !== undefined) {
        formData.append("base_unit", data.base_unit ? data.base_unit.toString() : "");
        if (data.operator !== undefined) formData.append("operator", data.operator || "");
        if (data.operation_value !== undefined) formData.append("operation_value", data.operation_value ? data.operation_value.toString() : "");
      }
      if (data.is_active !== undefined) formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Unit }>(`/units/${id}`, formData);
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
      toast.success("Unit updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update unit");
    },
  });
}

/**
 * useDeleteUnit
 *
 * Mutation hook to delete a single unit by ID.
 */
export function useDeleteUnit() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/units/${id}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      toast.success("Unit deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete unit");
    },
  });
}

/**
 * useBulkActivateUnits
 */
export function useBulkActivateUnits() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        "/units/bulk-activate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      toast.success("Units activated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to activate"),
  });
}

/**
 * useBulkDeactivateUnits
 */
export function useBulkDeactivateUnits() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        "/units/bulk-deactivate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      toast.success("Units deactivated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to deactivate"),
  });
}

/**
 * useBulkDestroyUnits
 */
export function useBulkDestroyUnits() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/units/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      toast.success("Units deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}

/**
 * useUnitsImport
 */
export function useUnitsImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/units/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      toast.success("Units imported");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}