import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { SmsSettingClient } from '@/features/settings/sms'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'SMS Setting',
}

export default async function SmsSettingPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'sms_setting')
  if (!canView) {
    return <ForbiddenError />
  }
  return <SmsSettingClient />
}
