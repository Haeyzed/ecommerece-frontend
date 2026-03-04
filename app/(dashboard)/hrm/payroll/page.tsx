import type { Metadata } from 'next'

import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { PayrollClient } from '@/features/hrm/payroll'

export const metadata: Metadata = {
  title: 'Payroll | HR Management System',
  description: 'Manage payroll runs and payslips.',
}

export default async function PayrollPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView =
    hasPermission(userPermissions, 'view payroll') ||
    hasPermission(userPermissions, 'view payroll runs')

  if (!canView) {
    return <ForbiddenError />
  }

  return <PayrollClient />
}
