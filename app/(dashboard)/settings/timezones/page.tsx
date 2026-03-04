import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { TimezonesClient } from '@/features/settings/timezones'

export const metadata = {
  title: 'Timezones Management',
}

export default async function TimezonesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view timezones')
  if (!canView) {
    return <ForbiddenError />
  }
  return <TimezonesClient />
}
