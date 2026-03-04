import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { EmployeesClient } from '@/features/hrm/employees'

export const metadata: Metadata = {
  title: 'Employees | HR Management System',
  description:
    'Manage company employees, organize teams, and control employees structure within the HR management system.',
}

export default async function DesignationsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view employees')

  if (!canView) {
    return <ForbiddenError />
  }

  return <EmployeesClient />
}
