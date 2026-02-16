import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CurrenciesClient } from '@/features/settings/currencies'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Currencies' }

export default async function CurrenciesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view currencies')) return <ForbiddenError />
  return <CurrenciesClient />
}
