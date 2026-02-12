import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { SupplierEditClient } from '@/features/people/suppliers/components/supplier-edit-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Edit Supplier',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function SupplierEditPage({ params }: Props) {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canUpdate = hasPermission(userPermissions, 'suppliers-update')
  if (!canUpdate) {
    return <ForbiddenError />
  }
  const { id } = await params
  return <SupplierEditClient id={id} />
}
