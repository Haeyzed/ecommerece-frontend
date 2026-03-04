import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { CategoriesClient } from '@/features/products/categories'

export const metadata = {
  title: 'Categories Management',
}

export default async function CategoriesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, 'view categories')
  if (!canView) {
    return <ForbiddenError />
  }
  return <CategoriesClient />
}
