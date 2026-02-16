import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { StatesClient } from '@/features/settings/states'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'States' }

export default async function StatesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view states')) return <ForbiddenError />
  return <StatesClient />
}
