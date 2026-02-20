import type { HolidayApprovalStatus } from './types';

export const approvalStatusTypes = new Map<HolidayApprovalStatus, string>([
  ['approved', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['pending', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
]);
