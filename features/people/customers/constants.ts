import { type CustomerActiveStatus } from './types'

export const statusTypes = new Map<CustomerActiveStatus, string>([
  ['active', 'border-green-500/50 text-green-700 dark:text-green-400'],
  ['inactive', 'border-muted-foreground/50'],
])

export const CUSTOMER_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const SAMPLE_CUSTOMERS_CSV = `customer_group_id,name,company_name,email,phone_number,address,city,country
1,John Doe,Acme Inc,john@example.com,+1234567890,123 Main St,New York,USA
2,Jane Smith,,jane@example.com,+0987654321,456 Oak Ave,Los Angeles,USA`

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
