import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { CitiesClient } from '@/features/settings/cities'

export const metadata = {
  title: 'Cities Management',
}

export default async function CitiesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view cities')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CitiesClient />
}
