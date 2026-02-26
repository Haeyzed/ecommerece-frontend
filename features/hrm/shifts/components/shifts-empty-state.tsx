"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useShifts } from '@/features/hrm/shifts'

export function ShiftsEmptyState() {
  const { setOpen } = useShifts()

  return (
    <DataTableEmptyState
      title="No shifts yet"
      description="You haven't created any work shifts yet. Get started by creating your first shift."
      primaryAction={{
        label: "Add Shift",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Shifts",
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