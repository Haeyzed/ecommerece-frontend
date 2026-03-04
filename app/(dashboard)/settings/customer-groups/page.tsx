import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomerGroupsClient } from '@/features/settings/customer-groups'

export const metadata = {
  title: 'Customer Groups',
}

export default async function CustomerGroupPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view customer groups')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CustomerGroupsClient />
}
