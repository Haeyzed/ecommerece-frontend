import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CountriesClient } from '@/features/settings/countries'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Countries',
}

export default async function CountriesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'view countries')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CountriesClient />
}
