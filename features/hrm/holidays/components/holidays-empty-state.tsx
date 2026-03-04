'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useHolidays } from '@/features/hrm/holidays'

export function HolidaysEmptyState() {
  const { setOpen } = useHolidays()

  return (
    <DataTableEmptyState
      title='No holidays yet'
      description="You haven't added any holidays yet. Get started by creating your first holiday record."
      primaryAction={{
        label: 'Add Holiday',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Holidays',
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
