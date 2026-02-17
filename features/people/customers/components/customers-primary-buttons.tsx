'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, PlusSignIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCustomersContext } from './customers-provider'
import { useAuthSession } from '@/features/auth/api'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomersContext()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const userPermissions = session?.user?.user_permissions || []
  const canImport = userPermissions.includes('import customers')
  const canExport = userPermissions.includes('export customers')
  const canCreate = userPermissions.includes('create customers')

  if (!canImport && !canExport && !canCreate) return null

  return (
    <div className="flex gap-2">
      {canExport && (
        <Button
          variant="outline"
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('export')}
          aria-label="Export Customers"
        >
          <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
          {!isMobile && <span>Export</span>}
        </Button>
      )}
      {canImport && (
        <Button
          variant="outline"
          size={isMobile ? 'icon' : 'default'}
          className={!isMobile ? 'space-x-1' : ''}
          onClick={() => setOpen('import')}
          aria-label="Import Customers"
        >
          <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} size={18} />
          {!isMobile && <span>Import</span>}
        </Button>
      )}
      {canCreate && (
        <Button asChild size={isMobile ? 'icon' : 'default'} className={!isMobile ? 'space-x-1' : ''}>
          <Link href="/people/customers/create" aria-label="Add Customer">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={18} />
            {!isMobile && <span>Add Customer</span>}
          </Link>
        </Button>
      )}
    </div>
  )
}
