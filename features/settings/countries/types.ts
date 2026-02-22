export interface Country {
  id: number;
  iso2: string;
  iso3: string | null;
  name: string;
  native: string | null;
  region: string | null;
  subregion: string | null;
  phone_code: string | null;
  latitude: string | null;
  longitude: string | null;
  emoji: string | null;
  emojiU: string | null;
  status: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CountryFormData {
  iso2: string;
  name: string;
  status?: boolean | null;
  phone_code?: string | null;
  iso3?: string | null;
  region?: string | null;
  subregion?: string | null;
  native?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  emoji?: string | null;
  emojiU?: string | null;
}

export type CountryListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type CountryExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface CountryOption {
  value: number;
  label: string;
  iso2?: string;
}

export type CountryActiveStatus = 'active' | 'inactive';