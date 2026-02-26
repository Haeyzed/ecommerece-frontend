"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useLeaveTypes } from '@/features/hrm/leave-types'

export function LeaveTypesEmptyState() {
  const { setOpen } = useLeaveTypes()

  return (
    <DataTableEmptyState
      title="No leave types yet"
      description="You haven't created any leave types yet. Get started by creating your first leave type."
      primaryAction={{
        label: "Add Leave Type",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Leave Types",
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