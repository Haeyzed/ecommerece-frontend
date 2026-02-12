import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { BillersClient } from '@/features/people/billers/components/billers-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Billers',
}

export default async function BillersPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'billers-index')
  if (!canView) {
    return <ForbiddenError />
  }
  return <BillersClient />
}
