/**
 * Biller feature constants
 */

export const BILLER_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const SAMPLE_BILLERS_CSV = `name,company_name,vat_number,email,phone_number,address,city,state,postal_code,country
Main Outlet,Quick Mart HQ,,biller@quickmart.com,+1234567890,123 Main St,New York,NY,10001,USA
Branch 1,Quick Mart Downtown,,branch1@quickmart.com,+0987654321,456 Oak Ave,Los Angeles,CA,90001,USA`

export const BILLER_EXPORT_COLUMNS = [
  'name',
  'company_name',
  'vat_number',
  'email',
  'phone_number',
  'address',
  'city',
  'state',
  'postal_code',
  'country',
  'is_active',
] as const
