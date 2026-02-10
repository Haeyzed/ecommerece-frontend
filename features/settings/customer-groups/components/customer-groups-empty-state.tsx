'use client'

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useCustomerGroups } from './customer-groups-provider'

export function CustomerGroupsEmptyState() {
  const { setOpen } = useCustomerGroups()

  return (
    <DataTableEmptyState
      title='No customer groups yet'
      description="You haven't created any customer groups yet. Get started by creating your first customer group."
      primaryAction={{
        label: 'Add Customer Group',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Customer Groups',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className='mr-2 size-4' />,
      }}
      learnMoreLink={{ href: '#', label: 'Learn more' }}
    />
  )
}
