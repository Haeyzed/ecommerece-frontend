import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Activity Log',
}

/** Redirect legacy activity-log route to audit-log */
export default function ActivityLogPage() {
  redirect('/reports/audit-log')
}
