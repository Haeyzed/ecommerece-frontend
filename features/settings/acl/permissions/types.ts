export type PermissionActiveStatus = 'active' | 'inactive';

export interface Permission {
  id: number;
  name: string;
  guard_name: string | null;
  module: string | null;
  description: string | null;
  is_active: boolean;
  active_status: PermissionActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface PermissionFormBody {
  name: string;
  guard_name?: string | null;
  module?: string | null;
  description?: string | null;
  is_active?: boolean | null;
}

export interface PermissionOption {
  value: number;
  label: string;
}

export type PermissionListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  module?: string;
  start_date?: string;
  end_date?: string;
};

export type PermissionExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};