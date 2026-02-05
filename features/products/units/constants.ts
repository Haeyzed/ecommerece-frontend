/**
 * Units Constants
 *
 * Defines status configurations, icons, and styling maps used throughout
 * the units module for consistent UI rendering.
 *
 * @module features/products/units/constants
 */

import { type UnitStatus } from "./types";

/**
 * Style mappings for Active status badges.
 * Keys match the `value` property in `activeStatuses`.
 */
export const statusTypes = new Map<UnitStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const SAMPLE_UNITS_CSV = `name,code,base_unit_id,operator,operation_value
Piece,pc,,,
Dozen,doz,1,*,12
Kilogram,kg,,,
Gram,g,3,/,1000`