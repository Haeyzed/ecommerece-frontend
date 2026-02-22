export interface State {
  id: number;
  name: string;
  code: string | null;
  country_id: number;
  country_code: string | null;
  state_code: string | null;
  type: string | null;
  latitude: string | null;
  longitude: string | null;
  country?: { id: number; name: string; iso2: string };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StateFormData {
  name: string;
  country_id: number;
  code?: string | null;
  country_code?: string | null;
  state_code?: string | null;
  type?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export type StateListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
};

export type StateExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface StateOption {
  value: number;
  label: string;
  state_code?: string;
  country_id?: number;
}

export type CityOption = {
  value: number;
  label: string
}