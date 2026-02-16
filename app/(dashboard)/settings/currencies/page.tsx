import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = { title: 'Currencies' }

export default async function CurrenciesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  if (!hasPermission(userPermissions, 'view currencies')) return <ForbiddenError />
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <h2 className='text-2xl font-bold tracking-tight'>Currencies List</h2>
      <p className='text-muted-foreground'>View World reference currencies. Full table implementation follows the same structure as Countries.</p>
    </div>
  )
}
