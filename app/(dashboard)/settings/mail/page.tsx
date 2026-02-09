import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { MailSettingClient } from '@/features/settings/mail'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Mail Setting',
}

export default async function MailSettingPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'mail_setting')
  if (!canView) {
    return <ForbiddenError />
  }
  return <MailSettingClient />
}
