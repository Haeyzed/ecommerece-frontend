import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { WarehousesClient } from '@/features/settings/warehouses'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Warehouse Management',
}

export default async function WarehousePage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'warehouses-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <WarehousesClient />
}
