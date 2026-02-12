'use client'

import { useRouter } from 'next/navigation'
import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useBillersContext } from './billers-provider'

export function BillersEmptyState() {
  const router = useRouter()
  const { setOpen } = useBillersContext()

  return (
    <DataTableEmptyState
      title="No billers yet"
      description="You haven't added any billers yet. Get started by adding your first biller or importing from a file."
      primaryAction={{
        label: 'Add Biller',
        onClick: () => router.push('/people/billers/create'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="mr-2 size-4" />,
      }}
      secondaryAction={{
        label: 'Import Billers',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />,
      }}
    />
  )
}
