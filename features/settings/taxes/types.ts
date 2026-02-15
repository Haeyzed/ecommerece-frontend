export interface Tax {
  id: number;
  name: string;
  rate: number;
  is_active: boolean;
  status: TaxStatus,
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

export type TaxStatus = 'active' | 'inactive';
