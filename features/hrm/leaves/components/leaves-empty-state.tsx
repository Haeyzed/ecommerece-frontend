"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useLeaves } from '@/features/hrm/leaves'

export function LeavesEmptyState() {
  const { setOpen } = useLeaves()

  return (
    <DataTableEmptyState
      title="No leave requests yet"
      description="You haven't recorded any employee leaves yet. Get started by adding a new leave request."
      primaryAction={{
        label: "Add Leave",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Leaves",
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