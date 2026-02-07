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
import { useAuthSession } from '@/features/auth/api' // Import session hook

export function TaxesPrimaryButtons() {
  const { setOpen } = useTaxes()
  const { data: session } = useAuthSession()
  
  // Get permissions safely
  const userPermissions = session?.user?.user_permissions || []

  // Check specific permissions
  const canImport = userPermissions.includes('taxes-import')
  const canCreate = userPermissions.includes('taxes-create')
  if (!canImport && !canCreate) return null

  return (
    <div className='flex gap-2'>
      {canImport && (
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() => setOpen('import')}
        >
          <span>Import Taxes</span> <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
        </Button>
      )}
      
      {canCreate && (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add Tax</span> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
        </Button>
      )}
    </div>
  )
}