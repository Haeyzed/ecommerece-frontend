"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useDesignations } from '@/features/hrm/designations'

export function DesignationsEmptyState() {
  const { setOpen } = useDesignations()

  return (
    <DataTableEmptyState
      title="No designations yet"
      description="You haven't created any designations yet. Get started by creating your first designation."
      primaryAction={{
        label: "Add Designation",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Designations",
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