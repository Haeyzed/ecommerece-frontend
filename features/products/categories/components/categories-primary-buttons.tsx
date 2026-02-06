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
import { useAuthSession } from '@/features/auth/api'

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('categories-import')
  const canCreate = userPermissions.includes('categories-create')
  if (!canImport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canImport && (
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() => setOpen('import')}
        >
          <span>Import Categories</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
        </Button>
      )}
      
      {canCreate && (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add Category</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
        </Button>
      )}
    </div>
  )
}