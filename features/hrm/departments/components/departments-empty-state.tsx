"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useDepartments } from '@/features/hrm/departments'

export function DepartmentsEmptyState() {
  const { setOpen } = useDepartments()

  return (
    <DataTableEmptyState
      title="No departments yet"
      description="You haven't created any departments yet. Get started by creating your first department."
      primaryAction={{
        label: "Add Department",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Departments",
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