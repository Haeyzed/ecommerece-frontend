"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useTimezones } from './timezones-provider'

export function TimezonesEmptyState() {
  const { setOpen } = useTimezones()

  return (
    <DataTableEmptyState
      title="No timezones yet"
      description="There are no timezones available yet. Get started by adding your first timezone."
      primaryAction={{
        label: "Add Timezone",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Timezones",
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