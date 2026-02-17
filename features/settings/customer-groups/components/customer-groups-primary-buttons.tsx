'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCustomerGroups } from './customer-groups-provider'
import { useAuthSession } from '@/features/auth/api'

export function CustomerGroupsPrimaryButtons() {
  const { setOpen } = useCustomerGroups()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('import customer groups')
  const canExport = userPermissions.includes('export customer groups')
  const canCreate = userPermissions.includes('create customer groups')

  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className="flex gap-2">
      {canExport && (
        <Button
          variant="outline"
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label="Export Customer Groups"
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export Customer Groups</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant="outline"
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label="Import Customer Groups"
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import Customer Groups</span>}
        </Button>
      )}
      {canCreate && (
        <Button
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('add')}
          aria-label='Add Customer Group'
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Add Customer Group</span>}
        </Button>
      )}
    </div>
  )
}
