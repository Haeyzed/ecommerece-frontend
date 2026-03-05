export type EmploymentTypeActiveStatus = 'active' | 'inactive'

export interface EmploymentType {
  id: number
  name: string
  is_active: boolean
  active_status: EmploymentTypeActiveStatus
  created_at: string | null
  updated_at: string | null
}

export interface EmploymentTypeFormBody {
  name: string
  is_active?: boolean | null
}

export interface EmploymentTypeOption {
  value: number
  label: string
}

export type EmploymentTypeListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  start_date?: string
  end_date?: string
}

export type EmploymentTypeExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}
