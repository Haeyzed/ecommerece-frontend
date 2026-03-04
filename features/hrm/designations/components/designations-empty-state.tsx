'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useDesignations } from '@/features/hrm/designations'

export function DesignationsEmptyState() {
  const { setOpen } = useDesignations()

  return (
    <DataTableEmptyState
      title='No designations yet'
      description="You haven't created any designations yet. Get started by creating your first designation."
      primaryAction={{
        label: 'Add Designation',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Designations',
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
