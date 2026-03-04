import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { AttendancesClient } from '@/features/hrm/attendances'

export const metadata: Metadata = {
  title: 'Attendance Types | HR Management System',
  description:
    'Manage company attendances, organize teams, and control attendances structure within the HR management system.',
}

export default async function AttendancesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view attendances')

  if (!canView) {
    return <ForbiddenError />
  }

  return <AttendancesClient />
}
