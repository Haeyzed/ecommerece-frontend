import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { CustomerViewClient } from '@/features/people/customers'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Customer',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function CustomerViewPage({ params }: Props) {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'customers-index')
  if (!canView) {
    return <ForbiddenError />
  }
  const { id } = await params
  return <CustomerViewClient id={id} />
}
