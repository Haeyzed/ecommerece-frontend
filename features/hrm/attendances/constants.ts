import { type AttendanceStatus } from "./types";

export const attendanceStatusStyles = new Map<AttendanceStatus, string>([
  ['present', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['late', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
]);