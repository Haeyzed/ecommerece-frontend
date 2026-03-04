'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useDepartments } from '@/features/hrm/departments'

export function DepartmentsEmptyState() {
  const { setOpen } = useDepartments()

  return (
    <DataTableEmptyState
      title='No departments yet'
      description="You haven't created any departments yet. Get started by creating your first department."
      primaryAction={{
        label: 'Add Department',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Departments',
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
