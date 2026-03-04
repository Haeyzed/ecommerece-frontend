import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { LanguagesClient } from '@/features/settings/languages'

export const metadata = {
  title: 'Languages Management',
}

export default async function LanguagesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view languages')
  if (!canView) {
    return <ForbiddenError />
  }
  return <LanguagesClient />
}
