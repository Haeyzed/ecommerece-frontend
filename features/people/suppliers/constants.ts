/**
 * Supplier feature constants
 */

export const SUPPLIER_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const SAMPLE_SUPPLIERS_CSV = `name,company_name,vat_number,email,phone_number,wa_number,address,city,state,postal_code,country,opening_balance
ABC Supplies,ABC Corp Ltd,,supplier@abc.com,+1234567890,,123 Industrial Ave,New York,NY,10001,USA,0
XYZ Wholesale,XYZ Wholesale Co,,contact@xyz.com,+0987654321,,456 Commerce St,Los Angeles,CA,90001,USA,0`

export const SUPPLIER_EXPORT_COLUMNS = [
  'name',
  'company_name',
  'vat_number',
  'email',
  'phone_number',
  'wa_number',
  'address',
  'city',
  'state',
  'postal_code',
  'country',
  'opening_balance',
  'pay_term_no',
  'pay_term_period',
  'is_active',
] as const
