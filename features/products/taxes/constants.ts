/**
 * Taxes Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the taxes module for consistent UI rendering.
 *
 * @module features/taxes/constants
 */

import { type TaxStatus } from "./types";

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const statusTypes = new Map<TaxStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])