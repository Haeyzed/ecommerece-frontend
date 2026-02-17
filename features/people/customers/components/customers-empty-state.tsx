'use client'

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useCustomersContext } from './customers-provider'

export function CustomersEmptyState() {
  const { setOpen } = useCustomersContext()

  return (
    <DataTableEmptyState
      title="No customers yet"
      description="You haven't added any customers yet. Get started by adding your first customer."
      primaryAction={{
        label: "Add Customer",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Customers",
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
