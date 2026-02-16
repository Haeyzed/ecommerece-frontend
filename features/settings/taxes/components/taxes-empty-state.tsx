"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useTaxes } from './taxes-provider'

export function TaxesEmptyState() {
  const { setOpen } = useTaxes()

  return (
    <DataTableEmptyState
      title="No taxes yet"
      description="You haven't created any taxes yet. Get started by creating your first tax."
      primaryAction={{
        label: "Add Tax",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Taxes",
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