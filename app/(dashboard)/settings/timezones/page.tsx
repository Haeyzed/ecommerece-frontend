import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { TimezonesClient } from '@/features/settings/timezones'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Timezones' }

export default async function TimezonesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view timezones')) return <ForbiddenError />
  return <TimezonesClient />
}
