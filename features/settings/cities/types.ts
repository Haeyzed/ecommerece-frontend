export interface City {
  id: number;
  name: string;
  country_id: number;
  state_id: number;
  country_code: string;
  state_code: string | null;
  latitude: string | null;
  longitude: string | null;
  country?: { id: number; name: string; iso2: string };
  state?: { id: number; name: string; state_code: string | null };
}

export interface CityOption {
  value: number;
  label: string;
  state_id?: number;
  country_id?: number;
}

export type CityListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
  state_id?: number;
};
