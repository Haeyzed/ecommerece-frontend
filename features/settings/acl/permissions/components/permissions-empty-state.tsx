'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { usePermissions } from '@/features/settings/acl/permissions'

export function PermissionsEmptyState() {
  const { setOpen } = usePermissions()

  return (
    <DataTableEmptyState
      title='No permissions yet'
      description="You haven't created any permissions yet. Get started by creating your first permission."
      primaryAction={{
        label: 'Add Permission',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Permissions',
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
