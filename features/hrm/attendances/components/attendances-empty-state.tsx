'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useAttendances } from '@/features/hrm/attendances'

export function AttendancesEmptyState() {
  const { setOpen } = useAttendances()

  return (
    <DataTableEmptyState
      title='No attendance records yet'
      description="You haven't recorded any employee attendances yet. Get started by adding a new record."
      primaryAction={{
        label: 'Add Attendance',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Attendances',
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
