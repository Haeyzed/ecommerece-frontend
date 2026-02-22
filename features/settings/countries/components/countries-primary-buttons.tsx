'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCountries } from './countries-provider'
import { useAuthSession } from '@/features/auth/api'

export function CountriesPrimaryButtons() {
  const { setOpen } = useCountries()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('import countries')
  const canExport = userPermissions.includes('export countries')
  const canCreate = userPermissions.includes('create countries')
  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canExport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label='Export Countries'
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export Countries</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant='outline'
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label='Import Countries'
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import Countries</span>}
        </Button>
      )}
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='Add Country'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Add Country</span>}
        </Button>
      )}
    </div>
  )
}