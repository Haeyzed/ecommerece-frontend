import { WarehouseActiveStatus } from '@/features/settings/warehouses/types'

export const statusTypes = new Map<WarehouseActiveStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
]);

export const SAMPLE_WAREHOUSES_CSV = `name,phone,email,address
Main Warehouse,+1234567890,warehouse@example.com,123 Main St
Secondary Warehouse,+0987654321,secondary@example.com,456 Oak Ave`;
