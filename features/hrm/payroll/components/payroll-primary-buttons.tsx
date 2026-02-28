'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { usePayroll } from '@/features/hrm/payroll'
import { useAuthSession } from '@/features/auth/api'

export function PayrollPrimaryButtons() {
  const { setOpen } = usePayroll()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create payrolls') || userPermissions.includes('view payroll runs')

  if (!canCreate) return null

  return (
    <div className='flex gap-2'>
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='New payroll run'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>New payroll run</span>}
        </Button>
      )}
    </div>
  )
}
