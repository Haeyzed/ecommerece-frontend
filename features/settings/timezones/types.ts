export interface Timezone {
  id: number;
  name: string;
  country_id: number;
  country?: { id: number; name: string; iso2: string };
}

export interface TimezoneOption {
  value: number;
  label: string;
  country_id?: number;
}

/** Timezone options grouped by region (e.g. Africa, America, Europe). */
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
