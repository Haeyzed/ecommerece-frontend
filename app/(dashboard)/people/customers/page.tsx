import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomersClient } from '@/features/people/customers/components/customers-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Customers',
}

export default async function CustomersPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'customers-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CustomersClient />
}
