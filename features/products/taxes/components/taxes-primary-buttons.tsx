'use client'

/**
 * TaxesPrimaryButtons
 *
 * Renders the main call-to-action buttons for the taxes view (Import, Add).
 * Triggers the respective dialogs via the TaxesProvider context.
 *
 * @component
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useTaxes } from './taxes-provider'

export function TaxesPrimaryButtons() {
  const { setOpen } = useTaxes()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import Taxes</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Tax</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
      </Button>
    </div>
  )
}