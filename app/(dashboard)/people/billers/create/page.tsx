import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { BillerCreateClient } from '@/features/people/billers/components/biller-create-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Add Biller',
}

export default async function BillerCreatePage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canCreate = hasPermission(userPermissions, 'billers-create')
  if (!canCreate) {
    return <ForbiddenError />
  }
  return <BillerCreateClient />
}
