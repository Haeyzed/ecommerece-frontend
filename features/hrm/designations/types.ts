export type DesignationActiveStatus = 'active' | 'inactive';

export interface Designation {
  id: number;
  name: string;
  is_active: boolean;
  active_status: DesignationActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface DesignationFormBody {
  name: string;
  is_active?: boolean | null;
}

export interface DesignationOption {
  value: number;
  label: string;
}

export type DesignationListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
};

export type DesignationExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};