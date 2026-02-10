/**
 * Customer group feature constants
 */

export const CUSTOMER_GROUP_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const SAMPLE_CUSTOMER_GROUPS_CSV = `name,percentage
VIP Customers,10
Wholesale,15
Retail,0
`
