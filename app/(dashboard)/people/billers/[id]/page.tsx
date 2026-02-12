import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { BillerViewClient } from '@/features/people/billers'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Biller',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function BillerViewPage({ params }: Props) {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'billers-index')
  if (!canView) {
    return <ForbiddenError />
  }
  const { id } = await params
  return <BillerViewClient id={id} />
}
