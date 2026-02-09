/**
 * Format audit old_values/new_values for human-readable display.
 * Converts snake_case keys to Title Case and displays as "Label: Value".
 */

/** Convert snake_case to Title Case (e.g. page_title → Page Title) */
export function formatKeyToLabel(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/** Format a single value for display */
export function formatValueForDisplay(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export interface FormattedAuditEntry {
  label: string
  value: string
}

/** Convert audit values object to array of { label, value } for display */
export function formatAuditValues(
  values: Record<string, unknown> | null
): FormattedAuditEntry[] {
  if (!values || typeof values !== 'object') return []
  return Object.entries(values).map(([key, val]) => ({
    label: formatKeyToLabel(key),
    value: formatValueForDisplay(val),
  }))
}
