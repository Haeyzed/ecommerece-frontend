import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Cities' }

export default async function CitiesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view cities')) return <ForbiddenError />
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <h2 className='text-2xl font-bold tracking-tight'>Cities List</h2>
      <p className='text-muted-foreground'>View World reference cities.</p>
    </div>
  )
}
