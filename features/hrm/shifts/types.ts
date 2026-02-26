export type ShiftActiveStatus = 'active' | 'inactive';

export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  grace_in: number;
  grace_out: number;
  total_hours: number;
  is_active: boolean;
  active_status: ShiftActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface ShiftFormBody {
  name: string;
  start_time: string;
  end_time: string;
  grace_in: number;
  grace_out: number;
  total_hours: number;
  is_active?: boolean | null;
}

export interface ShiftOption {
  value: number;
  label: string;
}

export type ShiftListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
};

export type ShiftExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};