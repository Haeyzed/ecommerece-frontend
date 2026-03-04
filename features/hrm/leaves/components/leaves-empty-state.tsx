'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useLeaves } from '@/features/hrm/leaves'

export function LeavesEmptyState() {
  const { setOpen } = useLeaves()

  return (
    <DataTableEmptyState
      title='No leave requests yet'
      description="You haven't recorded any employee leaves yet. Get started by adding a new leave request."
      primaryAction={{
        label: 'Add Leave',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Leaves',
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
