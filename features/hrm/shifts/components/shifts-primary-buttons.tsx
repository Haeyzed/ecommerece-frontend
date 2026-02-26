'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useShifts } from '@/features/hrm/shifts'
import { useAuthSession } from '@/features/auth/api'

export function ShiftsPrimaryButtons() {
  const { setOpen } = useShifts()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('import shifts')
  const canExport = userPermissions.includes('export shifts')
  const canCreate = userPermissions.includes('create shifts')
  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canExport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label='Export Shifts'
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export Shifts</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label='Import Shifts'
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import Shifts</span>}
        </Button>
      )}
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='Add Shift'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Add Shift</span>}
        </Button>
      )}
    </div>
  )
}