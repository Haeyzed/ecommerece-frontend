export interface Tax {
  id: number;
  name: string;
  rate: number;
  is_active: boolean;
  active_status: TaxActiveStatus,
  woocommerce_tax_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TaxFormData {
  name: string;
  rate: number;
  is_active?: boolean | null;
  woocommerce_tax_id?: number | null;
}

export type TaxListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type TaxExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface TaxOption {
  value: number;
  label: string;
}

export type TaxActiveStatus = 'active' | 'inactive';
