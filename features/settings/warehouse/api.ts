"use client";

/**
 * Warehouses API Hooks
 *
 * Client-side hooks for managing Warehouses using TanStack Query.
 * Handles CRUD operations, bulk actions, and file imports/exports.
 *
 * @module features/settings/warehouse/api
 */

import { useApiClient } from "@/lib/api/api-client-client";
import { ValidationError } from "@/lib/api/api-errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Warehouse, WarehouseFormData } from "./types";

export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...warehouseKeys.lists(), filters] as const,
  details: () => [...warehouseKeys.all, "detail"] as const,
  detail: (id: number) => [...warehouseKeys.details(), id] as const,
};

export function useWarehouses(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Warehouse[]>("/warehouses", { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useWarehouse(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Warehouse>(`/warehouses/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useCreateWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WarehouseFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email || "");
      if (data.address) formData.append("address", data.address || "");
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Warehouse }>("/warehouses", formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouse created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create warehouse");
    },
  });
}

export function useUpdateWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WarehouseFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      if (data.name) formData.append("name", data.name);
      if (data.phone !== undefined) formData.append("phone", data.phone || "");
      if (data.email !== undefined) formData.append("email", data.email || "");
      if (data.address !== undefined) formData.append("address", data.address || "");
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0");

      const response = await api.post<{ data: Warehouse }>(`/warehouses/${id}`, formData);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(variables.id) });
      toast.success("Warehouse updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update warehouse");
    },
  });
}

export function useDeleteWarehouse() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/warehouses/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouse deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete warehouse");
    },
  });
}

export function useBulkActivateWarehouses() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        "/warehouses/bulk-activate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouses activated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to activate"),
  });
}

export function useBulkDeactivateWarehouses() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        "/warehouses/bulk-deactivate",
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouses deactivated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to deactivate"),
  });
}

export function useBulkDestroyWarehouses() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.delete("/warehouses/bulk-destroy", {
        body: JSON.stringify({ ids }),
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouses deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });
}

export function useWarehousesImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post("/warehouses/import", form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      toast.success("Warehouses imported");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Import failed"),
  });
}

export type WarehouseExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
};

export function useWarehousesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: WarehouseExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob("/warehouses/export", params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `warehouses-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { message: "Export downloaded successfully" };
      }

      const response = await api.post("/warehouses/export", params);
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
