/**
 * Brands Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the brands module for consistent UI rendering.
 *
 * @module features/brands/constants
 */

import {
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from '@hugeicons/core-free-icons'

/**
 * Options for the Active/Inactive status filter and display.
 */
export const activeStatuses = [
  {
    value: 'active',
    label: 'Active',
    icon: CheckmarkCircle02Icon,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: CancelCircleIcon,
  },
] as const

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const activeStatusMap = new Map([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])