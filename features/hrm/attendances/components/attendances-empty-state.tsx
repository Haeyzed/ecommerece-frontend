"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useAttendances } from '@/features/hrm/attendances'

export function AttendancesEmptyState() {
  const { setOpen } = useAttendances()

  return (
    <DataTableEmptyState
      title="No attendance records yet"
      description="You haven't recorded any employee attendances yet. Get started by adding a new record."
      primaryAction={{
        label: "Add Attendance",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Attendances",
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