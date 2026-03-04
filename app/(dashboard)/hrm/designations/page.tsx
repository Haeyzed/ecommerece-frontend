import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { DesignationsClient } from '@/features/hrm/designations'

export const metadata: Metadata = {
  title: 'Designations | HR Management System',
  description:
    'Manage company designations, organize teams, and control designational structure within the HR management system.',
}

export default async function DesignationsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view designations')

  if (!canView) {
    return <ForbiddenError />
  }

  return <DesignationsClient />
}
