import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CitiesClient } from '@/features/settings/cities'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Cities' }

export default async function CitiesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view cities')) return <ForbiddenError />
  return <CitiesClient />
}
