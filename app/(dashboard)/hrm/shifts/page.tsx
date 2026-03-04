import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { ShiftsClient } from '@/features/hrm/shifts'

export const metadata: Metadata = {
  title: 'Shifts | HR Management System',
  description:
    'Manage company shifts, organize teams, and control shift structure within the HR management system.',
}

export default async function ShiftsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view shifts')

  if (!canView) {
    return <ForbiddenError />
  }

  return <ShiftsClient />
}
