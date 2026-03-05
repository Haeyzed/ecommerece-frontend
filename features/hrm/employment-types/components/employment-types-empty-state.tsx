'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useEmploymentTypes } from '@/features/hrm/employment-types'

export function EmploymentTypesEmptyState() {
  const { setOpen } = useEmploymentTypes()

  return (
    <DataTableEmptyState
      title='No employment types yet'
      description="You haven't created any employment types yet. Get started by creating your first employment type."
      primaryAction={{
        label: 'Add Employment Type',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Employment Types',
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
