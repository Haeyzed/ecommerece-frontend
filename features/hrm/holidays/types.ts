export interface Holiday {
  id: number;
  name: string;
  is_active: boolean;
  active_status: HolidayActiveStatus,
  created_at: string | null;
  updated_at: string | null;
}

export interface HolidayFormData {
  name: string;
  is_active?: boolean | null;
}

export type HolidayListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type HolidayExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface HolidayOption {
  value: number;
  label: string;
}

export type HolidayActiveStatus = 'active' | 'inactive';
