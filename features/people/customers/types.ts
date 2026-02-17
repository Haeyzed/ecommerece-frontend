/**
 * Customer types
 *
 * Aligns with Laravel API CustomerResource and related responses.
 */

export interface CustomerGroup {
  id: number
  name: string
  [key: string]: unknown
}

export interface Customer {
  id: number
  customer_group_id: number | null
  customer_group?: CustomerGroup | null
  user_id: number | null
  name: string
  company_name: string | null
  email: string | null
  type: string
  phone_number: string | null
  wa_number: string | null
  tax_no: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  opening_balance: number
  credit_limit: number
  points: number
  deposit: number
  deposited_balance?: number
  total_due?: number
  pay_term_no: number | null
  pay_term_period: string | null
  expense: number
  is_active: boolean
  active_status?: CustomerActiveStatus
  discount_plans?: string[]
  custom_fields?: Record<string, unknown>
  created_at: string | null
  updated_at: string | null
}

export type CustomerStatus = 'active' | 'inactive'

export type CustomerActiveStatus = 'active' | 'inactive'

export type CustomerListParams = {
  page?: number
  per_page?: number
  search?: string
  status?: string
  customer_group_id?: number
  start_date?: string
  end_date?: string
}

export type CustomerExportParams = {
  ids?: number[]
  format: 'excel' | 'pdf'
  method: 'download' | 'email'
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface CustomerOption {
  value: number
  label: string
}

/** Deposit record from API (DepositResource with user loaded). */
export interface CustomerDeposit {
  id: number
  customer_id: number
  amount: number
  note: string | null
  created_at: string | null
  updated_at: string | null
  user?: { id: number; name?: string; email?: string } | null
}

export interface CustomerFormData {
  customer_group_id?: number | null
  name: string
  company_name?: string | null
  email?: string | null
  type?: string | null
  phone_number?: string | null
  wa_number?: string | null
  tax_no?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  opening_balance?: number | null
  credit_limit?: number | null
  deposit?: number | null
  pay_term_no?: number | null
  pay_term_period?: string | null
  is_active?: boolean | null
  both?: boolean
  user?: boolean
  username?: string | null
  password?: string | null
}
