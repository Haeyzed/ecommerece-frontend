/**
 * Brands Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the brands module for consistent UI rendering.
 *
 * @module features/brands/constants
 */

import { type BrandStatus } from "./types";

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const statusTypes = new Map<BrandStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  // ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  // [
  //   'suspended',
  //   'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  // ],
])