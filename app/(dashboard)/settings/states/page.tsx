import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'States' }

export default async function StatesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view states')) return <ForbiddenError />
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <h2 className='text-2xl font-bold tracking-tight'>States List</h2>
      <p className='text-muted-foreground'>View World reference states. Full table implementation follows the same structure as Countries.</p>
    </div>
  )
}
