export interface Language {
  id: number;
  code: string;
  name: string;
  name_native: string | null;
  dir?: 'ltr' | 'rtl' | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LanguageFormData {
  code: string;
  name: string;
  name_native?: string | null;
  dir?: string | null;
}

export interface LanguageOption {
  value: number;
  label: string;
  code?: string;
  name_native?: string;
  dir?: 'ltr' | 'rtl' | null;
}

export type LanguageListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type LanguageExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};