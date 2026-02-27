export interface IdCardDesignConfig {
  primary_color: string;
  text_color: string;
  logo_url?: string | null;
  show_phone: boolean;
  show_address: boolean;
  show_qr_code: boolean;
}

export interface IdCardTemplate {
  id: number;
  name: string;
  design_config: IdCardDesignConfig;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface IdCardTemplateFormData {
  name: string;
  design_config: IdCardDesignConfig;
  is_active?: boolean | null;
}