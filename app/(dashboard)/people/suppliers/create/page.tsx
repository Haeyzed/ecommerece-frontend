import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { SupplierCreateClient } from '@/features/people/suppliers/components/supplier-create-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Add Supplier',
}

export default async function SupplierCreatePage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canCreate = hasPermission(userPermissions, 'suppliers-create')
  if (!canCreate) {
    return <ForbiddenError />
  }
  return <SupplierCreateClient />
}
