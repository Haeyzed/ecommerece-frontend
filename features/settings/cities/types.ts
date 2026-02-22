export interface City {
  id: number;
  name: string;
  country_id: number;
  state_id: number;
  country_code: string | null;
  state_code: string | null;
  latitude: string | null;
  longitude: string | null;
  country?: { id: number; name: string; iso2: string };
  state?: { id: number; name: string; state_code: string | null };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CityFormData {
  name: string;
  country_id: number;
  state_id: number;
  country_code?: string | null;
  state_code?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export type CityListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
  state_id?: number;
};

export type CityExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface CityOption {
  value: number;
  label: string;
  state_id?: number;
  country_id?: number;
}