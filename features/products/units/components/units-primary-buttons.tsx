'use client'

/**
 * UnitsPrimaryButtons
 *
 * Renders the main call-to-action buttons for the units view (Import, Add).
 * Triggers the respective dialogs via the UnitsProvider context.
 *
 * @component
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useUnits } from './units-provider'
import { useAuthSession } from '@/features/auth/api'

export function UnitsPrimaryButtons() {
  const { setOpen } = useUnits()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('units-import')
  const canCreate = userPermissions.includes('units-create')
  if (!canImport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canImport && (
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() => setOpen('import')}
        >
          <span>Import Units</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
        </Button>
      )}
      
      {canCreate && (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add Unit</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
        </Button>
      )}
    </div>
  )
}