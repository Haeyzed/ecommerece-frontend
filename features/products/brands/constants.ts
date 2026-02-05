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
])


export const SAMPLE_BRANDS_CSV = `name,short_description,image_url,page_title
Apple,Leading technology brand,https://example.com/apple.jpg,Apple Products
Samsung,Global electronics company,https://example.com/samsung.jpg,Samsung Devices
Nike,Just Do It,https://example.com/nike.jpg,Nike Sports`
