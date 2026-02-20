export interface Department {
  id: number;
  name: string;
  is_active: boolean;
  active_status: DepartmentActiveStatus,
  created_at: string | null;
  updated_at: string | null;
}

export interface DepartmentFormData {
  name: string;
  is_active?: boolean | null;
}

export type DepartmentListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type DepartmentExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface DepartmentOption {
  value: number;
  label: string;
}

export type DepartmentActiveStatus = 'active' | 'inactive';
