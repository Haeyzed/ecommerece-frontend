"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useCurrencies } from './currencies-provider'

export function CurrenciesEmptyState() {
  const { setOpen } = useCurrencies()

  return (
    <DataTableEmptyState
      title="No currencies yet"
      description="There are no currencies available yet. Get started by adding your first currency."
      primaryAction={{
        label: "Add Currency",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Currencies",
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