import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { GeneralSettingClient } from '@/features/settings/general'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'General Setting',
}

export default async function GeneralSettingPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'general_setting')
  if (!canView) {
    return <ForbiddenError />
  }
  return <GeneralSettingClient />
}
