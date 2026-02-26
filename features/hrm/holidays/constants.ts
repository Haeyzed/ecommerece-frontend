import { type HolidayApprovalStatus } from "./types";

export const statusTypes = new Map<HolidayApprovalStatus, string>([
  ['approved', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['unapproved', 'bg-neutral-300/40 border-neutral-300'],
]);