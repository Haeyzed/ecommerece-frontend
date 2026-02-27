"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useOvertimes } from '@/features/hrm/overtimes'

export function OvertimesEmptyState() {
  const { setOpen } = useOvertimes()

  return (
    <DataTableEmptyState
      title="No overtime records yet"
      description="You haven't recorded any employee overtimes yet. Get started by adding a new overtime record."
      primaryAction={{
        label: "Add Overtime",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Overtimes",
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