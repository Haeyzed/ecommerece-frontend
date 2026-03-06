export type ActiveStatus = 'active' | 'inactive'
export type SalesAgentStatus = 'yes' | 'no'

export interface SalesTarget {
  sales_from: number
  sales_to: number
  percent: number
}

export interface Role {
  id: number
  name: string
}

export interface Permission {
  id: number
  name: string
}

export interface User {
  id?: number
  name: string
  email: string
  username: string
  phone_number: string | null
  password?: string
  is_active?: boolean
  roles?: Role[]
  permissions?: Permission[]
}

export interface Profile {
  date_of_birth?: string | null
  gender?: string | null
  marital_status?: string | null
  national_id?: string | null
  tax_number?: string | null
  bank_name?: string | null
  account_number?: string | null
  emergency_contact?: any
}

export interface DocumentType {
  id: number
  name: string
  code?: string
  requires_expiry?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface Document {
  id: number
  document_type_id: number | string
  document_type?: DocumentType
  name?: string | null
  file_path?: string | null
  file_url?: string | null
  issue_date?: string | null
  expiry_date?: string | null
  notes?: string | null
  is_expired?: boolean
}

export interface Department {
  id: number
  name: string
}

export interface Designation {
  id: number
  name: string
}

export interface Shift {
  id: number
  name: string
  start_time: string
  end_time: string
}

export interface Country {
  id: number
  name: string
}

export interface State {
  id: number
  name: string
}

export interface City {
  id: number
  name: string
}

export interface EmploymentType {
  id: number
  name: string
}

export interface Warehouse {
  id: number
  name: string
}

export interface WorkLocation {
  id: number
  name: string
}

export interface SalaryStructure {
  id: number
  name: string
}

export interface ReportingManager {
  id: number
  name: string
  email: string
  username: string
  phone_number: string | null
  employee_code?: string | null
}

export interface Employee {
  id: number
  employee_code: string | null
  staff_id: string
  name: string
  email: string | null
  phone_number: string | null
  basic_salary: number
  address: string | null
  joining_date: string | null
  confirmation_date: string | null
  probation_end_date: string | null
  reporting_manager_id: number | null
  warehouse_id: number | null
  work_location_id: number | null
  salary_structure_id: number | null
  employment_status: string
  department?: Department | null
  designation?: Designation | null
  shift?: Shift | null
  country?: Country | null
  state?: State | null
  city?: City | null
  employment_type?: EmploymentType | null
  warehouse?: Warehouse | null
  work_location?: WorkLocation | null
  salary_structure?: SalaryStructure | null
  reporting_manager?: ReportingManager | null
  image_url: string | null
  image_path?: string | null
  is_active: boolean
  is_sale_agent: boolean
  sale_commission_percent: number | null
  sales_target: SalesTarget[]
  user?: User | null
  profile?: Profile | null
  documents?: Document[]
  active_status: ActiveStatus
  sales_agent: SalesAgentStatus
  created_at: string | null
  updated_at: string | null
}

export interface EmployeeOption {
  value: number
  label: string
}

export type EmployeeListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  is_sale_agent?: boolean
  department_id?: number
  designation_id?: number
  shift_id?: number
  country_id?: number
  state_id?: number
  city_id?: number
  start_date?: string
  end_date?: string
}

export type EmployeeExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}
