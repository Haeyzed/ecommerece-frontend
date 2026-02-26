export type HolidayApprovalStatus = 'approved' | 'unapproved';

export interface HolidayUser {
  id: number;
  name: string;
  email: string;
}

export interface Holiday {
  id: number;
  user_id?: number | null;
  user?: HolidayUser | null;
  from_date: string;
  to_date: string;
  note: string | null;
  recurring: boolean;
  region: string | null;
  is_approved: boolean;
  approve_status: HolidayApprovalStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface HolidayFormBody {
  from_date: string;
  to_date: string;
  note?: string | null;
  recurring?: boolean | null;
  region?: string | null;
  is_approved?: boolean | null;
}

export interface HolidayOption {
  value: number;
  label: string;
}

export type HolidayListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_approved?: boolean;
  recurring?: boolean;
  region?: string;
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