'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useShifts } from '@/features/hrm/shifts'

export function ShiftsEmptyState() {
  const { setOpen } = useShifts()

  return (
    <DataTableEmptyState
      title='No shifts yet'
      description="You haven't created any work shifts yet. Get started by creating your first shift."
      primaryAction={{
        label: 'Add Shift',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Shifts',
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
