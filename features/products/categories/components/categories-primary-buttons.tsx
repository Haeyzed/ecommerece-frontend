'use client'

/**
 * CategoriesPrimaryButtons
 *
 * Renders the main action buttons for the categories view (Add, Import).
 * Triggers the respective dialogs via the context provider.
 *
 * @component
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useCategories } from './categories-provider'

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import Categories</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Category</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
      </Button>
    </div>
  )
}