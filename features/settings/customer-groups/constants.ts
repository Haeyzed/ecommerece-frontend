/**
 * Customer Group Constants
 *
 * @module features/settings/customer-groups/constants
 */

export const statusTypes = new Map<string, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const CUSTOMER_GROUP_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const SAMPLE_CUSTOMER_GROUPS_CSV = `name,percentage
VIP Customers,10
Wholesale,15
Retail,0
`
