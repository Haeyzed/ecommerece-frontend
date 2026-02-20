"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useHolidays } from './holidays-provider'

export function HolidaysEmptyState() {
  const { setOpen } = useHolidays()

  return (
    <DataTableEmptyState
      title="No holidays yet"
      description="You haven't created any holidays yet. Get started by creating your first holiday."
      primaryAction={{
        label: "Add Holiday",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Holidays",
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