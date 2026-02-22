export interface Currency {
  id: number;
  name: string;
  code: string;
  precision: number | null;
  symbol: string;
  symbol_native: string | null;
  symbol_first: boolean;
  decimal_mark: string | null;
  thousands_separator: string | null;
  country_id: number;
  country?: { id: number; name: string; iso2: string };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CurrencyFormData {
  name: string;
  code: string;
  symbol: string;
  country_id: number;
  precision?: number | null;
  symbol_native?: string | null;
  symbol_first?: boolean | null;
  decimal_mark?: string | null;
  thousands_separator?: string | null;
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

export type CurrencyExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};