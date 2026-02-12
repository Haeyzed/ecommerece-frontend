import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { BillerEditClient } from '@/features/people/billers/components/biller-edit-client'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Edit Biller',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function BillerEditPage({ params }: Props) {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canUpdate = hasPermission(userPermissions, 'billers-update')
  if (!canUpdate) {
    return <ForbiddenError />
  }
  const { id } = await params
  return <BillerEditClient id={id} />
}
