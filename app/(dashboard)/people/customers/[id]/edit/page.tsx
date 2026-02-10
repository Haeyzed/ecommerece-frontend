import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomerEditClient } from '@/features/people/customers/components/customer-edit-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Edit Customer',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function CustomerEditPage({ params }: Props) {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canUpdate = hasPermission(userPermissions, 'customers-update')
  if (!canUpdate) {
    return <ForbiddenError />
  }
  const { id } = await params
  return <CustomerEditClient id={id} />
}
