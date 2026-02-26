"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useRoles } from '@/features/settings/acl/roles'

export function RolesEmptyState() {
  const { setOpen } = useRoles()

  return (
    <DataTableEmptyState
      title="No roles yet"
      description="You haven't created any roles yet. Get started by creating your first role."
      primaryAction={{
        label: "Add Role",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Roles",
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className="size-4 mr-2" />,
      }}
      learnMoreLink={{
        href: "#",
        label: "Learn more",
      }}
    />
  )
}