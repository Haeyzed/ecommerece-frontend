/**
 * Products API Hooks
 * Using TanStack Query for server state management
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api/api-client-client';
import { ValidationError } from '@/lib/api/api-errors';
import type { PaginationMeta } from '@/lib/api/api-types';
import type { Product, ProductFormData } from './types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

/**
 * Get all products with pagination
 */
export function useProducts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Product[]>(
        "/products",
        { params }
      );
      return response;
    },
    enabled: sessionStatus !== 'loading',
  });
  return { ...query, isSessionLoading: sessionStatus === 'loading' };
}

/**
 * Get single product
 */
export function useProduct(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return { ...query, isSessionLoading: sessionStatus === 'loading' };
}

/**
 * Create product mutation
 */
export function useCreateProduct() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await api.post<{ data: Product }>("/products", data);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Update product mutation
 */
export function useUpdateProduct() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductFormData> }) => {
      const response = await api.put<{ data: Product }>(`/products/${id}`, data);
      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

/**
 * Delete product mutation
 */
export function useDeleteProduct() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/products/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
