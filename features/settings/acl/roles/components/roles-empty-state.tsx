'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useRoles } from '@/features/settings/acl/roles'

export function RolesEmptyState() {
  const { setOpen } = useRoles()

  return (
    <DataTableEmptyState
      title='No roles yet'
      description="You haven't created any roles yet. Get started by creating your first role."
      primaryAction={{
        label: 'Add Role',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Roles',
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
