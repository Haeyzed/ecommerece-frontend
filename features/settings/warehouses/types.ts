export interface Warehouse {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  number_of_products?: number;
  stock_quantity?: number;
  is_active: boolean;
  active_status: WarehouseActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface WarehouseFormData {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active?: boolean | null;
}

export type WarehouseListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export type WarehouseExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface WarehouseOption {
  value: number;
  label: string;
}

export type WarehouseActiveStatus = 'active' | 'inactive';