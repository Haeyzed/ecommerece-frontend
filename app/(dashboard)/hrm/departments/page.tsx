import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { DepartmentsClient } from '@/features/hrm/departments'

export const metadata: Metadata = {
  title: 'Departments | HR Management System',
  description:
    'Manage company departments, organize teams, and control departmental structure within the HR management system.',
}

export default async function DepartmentsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view departments')

  if (!canView) {
    return <ForbiddenError />
  }

  return <DepartmentsClient />
}
