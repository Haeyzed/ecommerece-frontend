import { type TaxActiveStatus } from "./types";

export const statusTypes = new Map<TaxActiveStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const SAMPLE_TAXES_CSV = `name,rate
VAT,15
GST,18
Sales Tax,10
Service Tax,12`