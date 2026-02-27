import { type LeaveStatus } from "./types";

export const leaveStatusStyles = new Map<LeaveStatus, string>([
  ['Approved', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['Pending', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
  ['Rejected', 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200'],
]);