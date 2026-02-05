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

export function UnitsPrimaryButtons() {
  const { setOpen } = useUnits()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import Units</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Unit</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
      </Button>
    </div>
  )
}