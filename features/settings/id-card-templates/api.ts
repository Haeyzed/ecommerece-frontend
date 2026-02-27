'use client';

import { useApiClient } from '@/lib/api/api-client-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type IdCardTemplate, type IdCardTemplateFormData } from './types';

const BASE_PATH = '/id-card-templates';

export const idCardTemplateKeys = {
  all: ['id-card-templates'] as const,
  active: () => [...idCardTemplateKeys.all, 'active'] as const,
  lists: () => [...idCardTemplateKeys.all, 'list'] as const,
};

export function useActiveIdCardTemplate() {
  const { api } = useApiClient();
  return useQuery({
    queryKey: idCardTemplateKeys.active(),
    queryFn: async () => {
      // By typing api.get<IdCardTemplate>, response.data IS the IdCardTemplate.
      const response = await api.get<IdCardTemplate>(`${BASE_PATH}/active`);
      return response.data;
    },
  });
}

export function useIdCardTemplates() {
  const { api } = useApiClient();
  return useQuery({
    queryKey: idCardTemplateKeys.lists(),
    queryFn: async () => {
      const response = await api.get<IdCardTemplate[]>(BASE_PATH);
      return response.data ?? [];
    },
  });
}

export function useCreateIdCardTemplate() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IdCardTemplateFormData) => {
      const response = await api.post<IdCardTemplate>(BASE_PATH, data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.all });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateIdCardTemplate() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IdCardTemplateFormData> }) => {
      const response = await api.put<IdCardTemplate>(`${BASE_PATH}/${id}`, data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.all });
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.active() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useActivateIdCardTemplate() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<IdCardTemplate>(`${BASE_PATH}/${id}/activate`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.all });
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.active() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteIdCardTemplate() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<null>(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.all });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyIdCardTemplates() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deleted_count: number }>(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: idCardTemplateKeys.all });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}