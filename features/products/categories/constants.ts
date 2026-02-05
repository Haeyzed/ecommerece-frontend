/**
 * Categories Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the categories module for consistent UI rendering.
 *
 * @module features/categories/constants
 */

import { 
  type CategoryStatus, 
  type CategoryFeaturedStatus, 
  type CategorySyncStatus 
} from "./types";

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const statusTypes = new Map<CategoryStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
]);

/**
 * Style mappings for Featured status badges.
 * Featured items get a gold/amber highlight.
 */
export const featuredTypes = new Map<CategoryFeaturedStatus, string>([
  ['featured', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  ['not featured', 'bg-slate-100/30 text-slate-600 dark:text-slate-400 border-slate-200'],
]);

/**
 * Style mappings for Sync status badges.
 * Sync enabled uses blue/indigo to signify data flow.
 */
export const syncTypes = new Map<CategorySyncStatus, string>([
  ['enabled', 'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200'],
  ['disabled', 'bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200'],
]);