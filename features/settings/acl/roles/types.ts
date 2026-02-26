export type RoleActiveStatus = 'active' | 'inactive';

export interface RolePermission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  guard_name: string;
  is_active: boolean;
  active_status: RoleActiveStatus;
  permissions_count?: number;
  permissions?: RolePermission[];
  created_at: string | null;
  updated_at: string | null;
}

export interface RoleFormBody {
  name: string;
  description?: string | null;
  guard_name?: string | null;
  is_active?: boolean | null;
  permissions?: number[] | null;
}

export interface RoleOption {
  value: number;
  label: string;
}

export type RoleListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
};

export type RoleExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};