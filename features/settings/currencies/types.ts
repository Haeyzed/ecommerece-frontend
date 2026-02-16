export interface Currency {
  id: number;
  name: string;
  code: string;
  precision: number;
  symbol: string;
  symbol_native: string;
  symbol_first: boolean;
  decimal_mark: string;
  thousands_separator: string;
  country_id: number;
  country?: { id: number; name: string; iso2: string };
}

export interface CurrencyOption {
  value: number;
  label: string;
  code?: string;
  symbol?: string;
  country_id?: number;
}

export type CurrencyListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_id?: number;
};
