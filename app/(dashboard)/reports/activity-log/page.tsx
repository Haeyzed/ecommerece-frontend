import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { ActivityLogClient } from '@/features/reports/activity-log'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Activity Log',
}

export default async function ActivityLogPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'activity-log-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <ActivityLogClient />
}
