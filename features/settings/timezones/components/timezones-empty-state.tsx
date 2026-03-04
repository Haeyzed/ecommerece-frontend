'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useTimezones } from './timezones-provider'

export function TimezonesEmptyState() {
  const { setOpen } = useTimezones()

  return (
    <DataTableEmptyState
      title='No timezones yet'
      description='There are no timezones available yet. Get started by adding your first timezone.'
      primaryAction={{
        label: 'Add Timezone',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Timezones',
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
