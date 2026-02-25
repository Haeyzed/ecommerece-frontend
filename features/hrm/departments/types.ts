export type DepartmentActiveStatus = 'active' | 'inactive';

export interface Department {
  id: number;
  name: string;
  is_active: boolean;
  active_status: DepartmentActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface DepartmentFormBody {
  name: string;
  is_active?: boolean | null;
}

export interface DepartmentOption {
  value: number;
  label: string;
}

export type DepartmentListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
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