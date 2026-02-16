import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { LanguagesClient } from '@/features/settings/languages'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Languages' }

export default async function LanguagesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view languages')) return <ForbiddenError />
  return <LanguagesClient />
}
