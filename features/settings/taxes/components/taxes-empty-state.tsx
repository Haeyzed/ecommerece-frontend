'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useTaxes } from './taxes-provider'

export function TaxesEmptyState() {
  const { setOpen } = useTaxes()

  return (
    <DataTableEmptyState
      title='No taxes yet'
      description="You haven't created any taxes yet. Get started by creating your first tax."
      primaryAction={{
        label: 'Add Tax',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Taxes',
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
