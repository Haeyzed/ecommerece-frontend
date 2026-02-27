'use client';

import { useApiClient } from '@/lib/api/api-client-client'
import { ValidationError } from '@/lib/api/api-errors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Employee, EmployeeExportParams, EmployeeListParams, EmployeeOption } from './types'
import type { EmployeeFormData } from './schemas'

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  options: () => [...employeeKeys.all, 'options'] as const,
  template: () => [...employeeKeys.all, 'template'] as const,
};

const BASE_PATH = '/employees';

export function usePaginatedEmployees(params?: EmployeeListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      return await api.get<Employee[]>(BASE_PATH, { params });
    },
    enabled: sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useOptionEmployees() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: employeeKeys.options(),
    queryFn: async () => {
      const response = await api.get<EmployeeOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== 'loading',
  });
}

export function useEmployee(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Employee>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== 'loading',
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === 'loading',
  };
}

export function useCreateEmployee() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("staff_id", data.staff_id);
      if (data.email) formData.append("email", data.email);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      formData.append("basic_salary", String(data.basic_salary));
      if (data.address) formData.append("address", data.address);

      formData.append("department_id", String(data.department_id));
      formData.append("designation_id", String(data.designation_id));
      formData.append("shift_id", String(data.shift_id));

      if (data.country_id != null) formData.append("country_id", String(data.country_id));
      if (data.state_id != null) formData.append("state_id", String(data.state_id));
      if (data.city_id != null) formData.append("city_id", String(data.city_id));

      if (data.is_active !== undefined && data.is_active !== null) {
        formData.append("is_active", data.is_active ? "1" : "0");
      }
      if (data.is_sale_agent !== undefined && data.is_sale_agent !== null) {
        formData.append("is_sale_agent", data.is_sale_agent ? "1" : "0");
      }
      if (data.sale_commission_percent !== undefined && data.sale_commission_percent !== null) {
        formData.append("sale_commission_percent", String(data.sale_commission_percent));
      }

      const images = data.image as File[] | undefined;
      if (images && images.length > 0) {
        formData.append("image", images[0]);
      }

      if (data.sales_target && data.sales_target.length > 0) {
        data.sales_target.forEach((target, index) => {
          formData.append(`sales_target[${index}][sales_from]`, String(target.sales_from));
          formData.append(`sales_target[${index}][sales_to]`, String(target.sales_to));
          formData.append(`sales_target[${index}][percent]`, String(target.percent));
        });
      }

      if (data.user_id != null) formData.append("user_id", String(data.user_id));

      if (data.user) {
        if (data.user.username) formData.append('user[username]', data.user.username);
        if (data.user.password) formData.append('user[password]', data.user.password);
        if (data.user.roles && data.user.roles.length > 0) {
          data.user.roles.forEach((id, idx) => formData.append(`user[roles][${idx}]`, String(id)));
        }
        if (data.user.permissions && data.user.permissions.length > 0) {
          data.user.permissions.forEach((id, idx) => formData.append(`user[permissions][${idx}]`, String(id)));
        }
      }

      const response = await api.post<{ data: Employee }>(BASE_PATH, formData);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateEmployee() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<EmployeeFormData> }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.staff_id) formData.append("staff_id", data.staff_id);
      if (data.email !== undefined) formData.append("email", data.email ?? "");
      if (data.phone_number !== undefined) formData.append("phone_number", data.phone_number ?? "");
      if (data.address !== undefined) formData.append("address", data.address ?? "");
      if (data.basic_salary !== undefined) formData.append("basic_salary", String(data.basic_salary));

      if (data.department_id !== undefined) formData.append("department_id", String(data.department_id));
      if (data.designation_id !== undefined) formData.append("designation_id", String(data.designation_id));
      if (data.shift_id !== undefined) formData.append("shift_id", String(data.shift_id));

      if (data.country_id !== undefined) formData.append("country_id", data.country_id != null ? String(data.country_id) : "");
      if (data.state_id !== undefined) formData.append("state_id", data.state_id != null ? String(data.state_id) : "");
      if (data.city_id !== undefined) formData.append("city_id", data.city_id != null ? String(data.city_id) : "");

      if (data.is_active !== undefined && data.is_active !== null) {
        formData.append("is_active", data.is_active ? "1" : "0");
      }
      if (data.is_sale_agent !== undefined && data.is_sale_agent !== null) {
        formData.append("is_sale_agent", data.is_sale_agent ? "1" : "0");
      }
      if (data.sale_commission_percent !== undefined) {
        formData.append("sale_commission_percent", data.sale_commission_percent != null ? String(data.sale_commission_percent) : "");
      }

      const images = data.image as File[] | undefined;
      if (images && images.length > 0) {
        formData.append("image", images[0]);
      }

      if (data.sales_target && data.sales_target.length > 0) {
        data.sales_target.forEach((target, index) => {
          formData.append(`sales_target[${index}][sales_from]`, String(target.sales_from));
          formData.append(`sales_target[${index}][sales_to]`, String(target.sales_to));
          formData.append(`sales_target[${index}][percent]`, String(target.percent));
        });
      } else if (data.sales_target && data.sales_target.length === 0) {
        formData.append("sales_target", "");
      }

      if (data.user_id !== undefined) formData.append("user_id", data.user_id != null ? String(data.user_id) : "");

      if (data.user) {
        if (data.user.username) formData.append('user[username]', data.user.username);
        if (data.user.password) formData.append('user[password]', data.user.password);

        if (data.user.roles && data.user.roles.length > 0) {
          data.user.roles.forEach((roleId, idx) => formData.append(`user[roles][${idx}]`, String(roleId)));
        } else if (data.user.roles && data.user.roles.length === 0) {
          formData.append("user[roles]", "");
        }

        if (data.user.permissions && data.user.permissions.length > 0) {
          data.user.permissions.forEach((permId, idx) => formData.append(`user[permissions][${idx}]`, String(permId)));
        } else if (data.user.permissions && data.user.permissions.length === 0) {
          formData.append("user[permissions]", "");
        }
      }

      const response = await api.post<{ data: Employee }>(`${BASE_PATH}/${id}`, formData);
      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }
      return { id, message: response.message };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(data.id) });
      toast.success(data.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteEmployee() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkActivateEmployees() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDeactivateEmployees() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.patch<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      );
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBulkDestroyEmployees() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post(`${BASE_PATH}/bulk-destroy`, { ids });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEmployeesImport() {
  const { api } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const response = await api.post(`${BASE_PATH}/import`, form);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEmployeesExport() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (params: EmployeeExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName = `employees-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { message: "Export downloaded successfully" };
      }

      const response = await api.post(`${BASE_PATH}/export`, params);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEmployeesTemplateDownload() {
  const { api } = useApiClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employees-sample.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { message: "Sample template downloaded" };
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
}