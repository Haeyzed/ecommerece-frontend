'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useBillers } from './billers-provider'

export function BillersEmptyState() {
  const { setOpen } = useBillers()

  return (
    <DataTableEmptyState
      title='No billers yet'
      description="You haven't added any billers yet. Get started by adding your first biller."
      primaryAction={{
        label: 'Add Biller',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Billers',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className='mr-2 size-4' />,
      }}
      learnMoreLink={{
        href: '#',
        label: 'Learn more',
      }}
    />
  )
}
