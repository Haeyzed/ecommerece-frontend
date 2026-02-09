import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { AuditLogClient } from '@/features/reports/audit-log'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Audit Log',
}

export default async function AuditLogPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'activity-log-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <AuditLogClient />
}
