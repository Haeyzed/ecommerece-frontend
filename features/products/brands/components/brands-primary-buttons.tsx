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
import { useAuthSession } from '@/features/auth/api' // Import the session hook

export function BrandsPrimaryButtons() {
  const { setOpen } = useBrands()
  const { data: session } = useAuthSession()
  
  // Get permissions safely from the session (default to empty array if loading/undefined)
  const userPermissions = session?.user?.user_permissions || []

  // Define the checks
  const canImport = userPermissions.includes('brands-import')
  const canCreate = userPermissions.includes('brands-create')

  // If the user has neither permission, hide the entire container
  if (!canImport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canImport && (
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() => setOpen('import')}
        >
          <span>Import Brands</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
        </Button>
      )}
      
      {canCreate && (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add Brand</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
        </Button>
      )}
    </div>
  )
}