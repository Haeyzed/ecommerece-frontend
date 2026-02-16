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
}

export interface StateOption {
  value: number;
  label: string;
  state_code?: string;
  country_id?: number;
}

export type StateListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
};
