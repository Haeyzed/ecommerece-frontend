import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomerDueReportClient } from '@/features/reports/customer-due'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Customer Due Report',
}

export default async function CustomerDueReportPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'due-report')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CustomerDueReportClient />
}
