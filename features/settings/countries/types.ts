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
}

export interface CountryOption {
  value: number;
  label: string;
  iso2?: string;
}

export type CountryListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};
