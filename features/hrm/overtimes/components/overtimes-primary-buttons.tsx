'use client'

import {
  FileImportIcon,
  PlusSignIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { useMediaQuery } from '@/hooks/use-media-query'

import { Button } from '@/components/ui/button'

import { useAuthSession } from '@/features/auth/api'
import { useOvertimes } from '@/features/hrm/overtimes/components/overtimes-provider'

export function OvertimesPrimaryButtons() {
  const { setOpen } = useOvertimes()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []

  const canImport = userPermissions.includes('import overtimes')
  const canExport = userPermissions.includes('export overtimes')
  const canCreate = userPermissions.includes('create overtimes')

  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canExport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label='Export Overtimes'
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export Overtimes</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label='Import Overtimes'
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import Overtimes</span>}
        </Button>
      )}
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='Add Overtime'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Add Overtime</span>}
        </Button>
      )}
    </div>
  )
}
