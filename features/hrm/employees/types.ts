export type EmployeeActiveStatus = 'active' | 'inactive';
export type EmployeeSalesAgentStatus = 'yes' | 'no';

export interface EmployeeSalesTarget {
  sales_from: number;
  sales_to: number;
  percent: number;
}

export interface RolePermission {
  id: number;
  name: string;
}

export interface EmployeeUser {
  id?: number;
  name: string;
  email: string;
  username: string;
  phone_number: string | null;
  password?: string;
  is_active?: boolean;
  roles?: RolePermission[];
  permissions?: RolePermission[];
}

export interface EmployeeProfile {
  date_of_birth?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  national_id?: string | null;
  tax_number?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
}

export interface EmployeeDocument {
  id?: number;
  document_type_id: number;
  name?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
  is_expired?: boolean;
}

export interface EmployeeDepartment {
  id: number;
  name: string;
}

export interface EmployeeDesignation {
  id: number;
  name: string;
}

export interface EmployeeShift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface EmployeeCountry {
  id: number;
  name: string;
}

export interface EmployeeState {
  id: number;
  name: string;
}

export interface EmployeeCity {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  employee_code: string;
  staff_id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  basic_salary: number;
  address: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  department_id: number | null;
  designation_id: number | null;
  shift_id: number | null;
  department?: EmployeeDepartment | null;
  designation?: EmployeeDesignation | null;
  shift?: EmployeeShift | null;
  country?: EmployeeCountry | null;
  state?: EmployeeState | null;
  city?: EmployeeCity | null;
  image_url: string | null;
  is_active: boolean;
  is_sale_agent: boolean;
  sale_commission_percent: number | null;
  sales_target: EmployeeSalesTarget[];
  user_id: number | null;
  user?: EmployeeUser | null;
  profile?: EmployeeProfile | null;
  documents?: EmployeeDocument[];
  active_status: EmployeeActiveStatus;
  sales_agent: EmployeeSalesAgentStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmployeeOption {
  value: number;
  label: string;
}

export type EmployeeListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  is_sale_agent?: boolean;
  department_id?: number;
  designation_id?: number;
  shift_id?: number;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  start_date?: string;
  end_date?: string;
};

export type EmployeeExportParams = {
  ids?: number[];
  format: 'excel' | 'pdf';
  method: 'download' | 'email';
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};