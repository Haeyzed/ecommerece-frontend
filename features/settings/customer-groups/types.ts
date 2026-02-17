export interface CustomerGroup {
  id: number
  name: string
  percentage: string | number
  is_active: boolean
  active_status?: 'active' | 'inactive'
  created_at: string | null
  updated_at: string | null
}

export type CustomerGroupStatus = 'active' | 'inactive'

export type CustomerGroupListParams = {
  page?: number
  per_page?: number
  search?: string
  status?: string
  start_date?: string
  end_date?: string
}

export type CustomerGroupExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface CustomerGroupOption {
  value: number
  label: string
}
