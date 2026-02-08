'use client'

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useWarehouses } from './warehouses-provider'

export function WarehousesEmptyState() {
  const { setOpen } = useWarehouses()

  return (
    <DataTableEmptyState
      title='No warehouses yet'
      description="You haven't created any warehouses yet. Get started by creating your first warehouse."
      primaryAction={{
        label: 'Add Warehouse',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Warehouses',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className='mr-2 size-4' />,
      }}
      learnMoreLink={{ href: '#', label: 'Learn more' }}
    />
  )
}
