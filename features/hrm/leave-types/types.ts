export type LeaveTypeActiveStatus = 'active' | 'inactive';

export interface LeaveType {
  id: number;
  name: string;
  annual_quota: number;
  encashable: boolean;
  carry_forward_limit: number;
  is_active: boolean;
  active_status: LeaveTypeActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface LeaveTypeFormBody {
  name: string;
  annual_quota: number;
  encashable: boolean;
  carry_forward_limit: number;
  is_active?: boolean | null;
}

export interface LeaveTypeOption {
  value: number;
  label: string;
}

export type LeaveTypeListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
};

export type LeaveTypeExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};