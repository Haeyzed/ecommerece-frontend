'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useEmployees } from '@/features/hrm/employees'

export function EmployeesEmptyState() {
  const { setOpen } = useEmployees()

  return (
    <DataTableEmptyState
      title='No employees yet'
      description="You haven't created any employees yet. Get started by creating your first employee."
      primaryAction={{
        label: 'Add Employee',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Employees',
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
