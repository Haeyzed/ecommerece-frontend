/** Holiday (leave request) as returned by the API */
export interface Holiday {
  id: number;
  user_id: number;
  from_date: string | null;
  to_date: string | null;
  note: string | null;
  is_approved: boolean;
  recurring: boolean | null;
  region: string | null;
  created_at: string | null;
  updated_at: string | null;
  /** Present when user relation is loaded */
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

/** Form payload for create/update holiday */
export interface HolidayFormData {
  user_id?: number | null;
  from_date: string;
  to_date: string;
  note?: string | null;
  is_approved?: boolean | null;
  recurring?: boolean | null;
  region?: string | null;
}

/** List query params for holidays (filters + pagination) */
export type HolidayListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  user_id?: number;
  is_approved?: boolean;
  start_date?: string;
  end_date?: string;
};

/** Export request params */
export type HolidayExportParams = {
  ids?: number[];
  format: 'excel' | 'pdf';
  method: 'download' | 'email';
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface HolidayOption {
  value: number;
  label: string;
}

/** Approval status for display (approved | pending) */
export type HolidayApprovalStatus = 'approved' | 'pending';
