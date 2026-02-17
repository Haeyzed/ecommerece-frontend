import { type CustomerGroupStatus } from './types'

export const statusTypes = new Map<CustomerGroupStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const SAMPLE_CUSTOMER_GROUPS_CSV = `name,percentage
VIP Customers,10
Wholesale,15
Retail,0
`
