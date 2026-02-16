export interface Biller {
  id: number;
  name: string;
  company_name: string;
  vat_number: string | null;
  email: string;
  phone_number: string;
  address: string;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  country?: { id: number; name: string } | null;
  state?: { id: number; name: string } | null;
  city?: { id: number; name: string } | null;
  postal_code: string | null;
  image: string | null;
  image_url: string | null;
  is_active: boolean;
  active_status: BillerActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface BillerFormData {
  name: string;
  company_name: string;
  vat_number?: string | null;
  email: string;
  phone_number: string;
  address: string;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  postal_code?: string | null;
  image?: File[] | null;
  is_active?: boolean | null;
}

export type BillerListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type BillerExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface BillerOption {
  value: number;
  label: string;
}

export type BillerActiveStatus = 'active' | 'inactive';