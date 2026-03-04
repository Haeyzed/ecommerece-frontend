import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { TaxesClient } from '@/features/settings/taxes'

export const metadata = {
  title: 'Taxes Management',
}

export default async function TaxesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view taxes')
  if (!canView) {
    return <ForbiddenError />
  }
  return <TaxesClient />
}
