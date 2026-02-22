export interface Timezone {
  id: number;
  name: string;
  country_id: number;
  country?: { id: number; name: string; iso2: string };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TimezoneFormData {
  name: string;
  country_id: number;
}

export interface TimezoneOption {
  value: number;
  label: string;
  country_id?: number;
}

export interface TimezoneOptionsGrouped {
  region: string;
  options: TimezoneOption[];
}

export type TimezoneListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
};

export type TimezoneExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};