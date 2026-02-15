export interface Brand {
  id: number;
  name: string;
  slug: string | null;
  short_description: string | null;
  page_title: string | null;
  image: string | null;
  image_url: string | null;
  is_active: boolean;
  active_status: BrandActiveStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface BrandFormData {
  name: string;
  slug?: string | null;
  short_description?: string | null;
  page_title?: string | null;
  image?: File[] | null;
  is_active?: boolean | null;
}

export type BrandExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};

export interface BrandOption {
  value: number;
  label: string;
}

export type BrandActiveStatus = 'active' | 'inactive';
