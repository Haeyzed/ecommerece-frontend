'use client'

import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { useMediaQuery } from '@/hooks/use-media-query'

import { Button } from '@/components/ui/button'

import { useAuthSession } from '@/features/auth/api'
import { usePayroll } from '@/features/hrm/payroll'

export function PayrollPrimaryButtons() {
  const { setOpen } = usePayroll()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []
  const canCreate =
    userPermissions.includes('create payrolls') ||
    userPermissions.includes('view payroll runs')

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
