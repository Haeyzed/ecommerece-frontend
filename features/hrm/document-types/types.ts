export type DocumentTypeActiveStatus = 'active' | 'inactive'

export interface DocumentType {
  id: number
  name: string
  code: string
  requires_expiry: boolean
  is_active: boolean
  active_status: DocumentTypeActiveStatus
  created_at: string | null
  updated_at: string | null
}

export interface DocumentTypeFormBody {
  name: string
  code: string
  requires_expiry: boolean
  is_active?: boolean | null
}

export interface DocumentTypeOption {
  value: number
  label: string
  requires_expiry: boolean
}

export type DocumentTypeListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  start_date?: string
  end_date?: string
}

export type DocumentTypeExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}
