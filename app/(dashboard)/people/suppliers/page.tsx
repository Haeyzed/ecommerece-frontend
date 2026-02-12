import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { SuppliersClient } from '@/features/people/suppliers/components/suppliers-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Suppliers',
}

export default async function SuppliersPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'suppliers-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <SuppliersClient />
}
