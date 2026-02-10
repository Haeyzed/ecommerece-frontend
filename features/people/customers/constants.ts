/**
 * Customer feature constants
 */

export const CUSTOMER_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const CUSTOMER_EXPORT_COLUMNS = [
  'name',
  'company_name',
  'email',
  'phone_number',
  'wa_number',
  'address',
  'city',
  'state',
  'postal_code',
  'country',
  'opening_balance',
  'credit_limit',
  'deposit',
  'is_active',
] as const
