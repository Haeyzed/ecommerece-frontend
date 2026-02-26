"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { usePermissions } from '@/features/settings/acl/permissions'

export function PermissionsEmptyState() {
  const { setOpen } = usePermissions()

  return (
    <DataTableEmptyState
      title="No permissions yet"
      description="You haven't created any permissions yet. Get started by creating your first permission."
      primaryAction={{
        label: "Add Permission",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Permissions",
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