'use client'

import { useRouter } from 'next/navigation'
import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useCustomersContext } from './customers-provider'

export function CustomersEmptyState() {
  const router = useRouter()
  const { setOpen } = useCustomersContext()

  return (
    <DataTableEmptyState
      title="No customers yet"
      description="You haven't added any customers yet. Get started by adding your first customer or importing from a file."
      primaryAction={{
        label: 'Add Customer',
        onClick: () => router.push('/people/customers/create'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="mr-2 size-4" />,
      }}
      secondaryAction={{
        label: 'Import Customers',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />,
      }}
    />
  )
}
