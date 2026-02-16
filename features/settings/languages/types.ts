export interface Language {
  id: number;
  code: string;
  name: string;
  name_native: string;
  dir: string;
}

export interface LanguageOption {
  value: number;
  label: string;
  code?: string;
  name_native?: string;
  dir?: string;
}

export type LanguageListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};
