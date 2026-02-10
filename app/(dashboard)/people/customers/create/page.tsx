import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomerCreateClient } from '@/features/people/customers/components/customer-create-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Add Customer',
}

export default async function CustomerCreatePage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canCreate = hasPermission(userPermissions, 'customers-create')
  if (!canCreate) {
    return <ForbiddenError />
  }
  return <CustomerCreateClient />
}
