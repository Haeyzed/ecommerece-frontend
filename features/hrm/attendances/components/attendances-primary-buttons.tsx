'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAttendances } from '@/features/hrm/attendances/components/attendances-provider'
import { useAuthSession } from '@/features/auth/api'

export function AttendancesPrimaryButtons() {
  const { setOpen } = useAttendances()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []

  const canImport = userPermissions.includes('import attendances')
  const canExport = userPermissions.includes('export attendances')
  const canCreate = userPermissions.includes('create attendances')

  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canExport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label='Export Attendances'
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export Attendances</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label='Import Attendances'
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import Attendances</span>}
        </Button>
      )}
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='Add Attendance'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Add Attendance</span>}
        </Button>
      )}
    </div>
  )
}