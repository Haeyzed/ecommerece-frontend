/**
 * Customer group types
 *
 * Aligns with Laravel API CustomerGroupResource.
 */

export interface CustomerGroup {
  id: number
  name: string
  percentage: string | number
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export type CustomerGroupStatus = 'active' | 'inactive'
