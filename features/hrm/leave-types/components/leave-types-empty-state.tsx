'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useLeaveTypes } from '@/features/hrm/leave-types'

export function LeaveTypesEmptyState() {
  const { setOpen } = useLeaveTypes()

  return (
    <DataTableEmptyState
      title='No leave types yet'
      description="You haven't created any leave types yet. Get started by creating your first leave type."
      primaryAction={{
        label: 'Add Leave Type',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Leave Types',
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
