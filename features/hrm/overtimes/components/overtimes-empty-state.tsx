'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useOvertimes } from '@/features/hrm/overtimes'

export function OvertimesEmptyState() {
  const { setOpen } = useOvertimes()

  return (
    <DataTableEmptyState
      title='No overtime records yet'
      description="You haven't recorded any employee overtimes yet. Get started by adding a new overtime record."
      primaryAction={{
        label: 'Add Overtime',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Overtimes',
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
