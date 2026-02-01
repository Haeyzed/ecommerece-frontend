'use client'

/**
 * BrandsPrimaryButtons
 *
 * Renders the main call-to-action buttons for the brands view (Import, Add).
 * Triggers the respective dialogs via the BrandsProvider context.
 *
 * @component
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useBrands } from './brands-provider'

export function BrandsPrimaryButtons() {
  const { setOpen } = useBrands()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import Brands</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Brand</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
      </Button>
    </div>
  )
}