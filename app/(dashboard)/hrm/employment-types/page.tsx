import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { EmploymentTypesClient } from '@/features/hrm/employment-types'

export const metadata: Metadata = {
  title: 'Employment Types | HR Management System',
  description:
    'Manage company employment types, organize teams, and control employment types structure within the HR management system.',
}

export default async function EmploymentTypesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view employment types')

  if (!canView) {
    return <ForbiddenError />
  }

  return <EmploymentTypesClient />
}
