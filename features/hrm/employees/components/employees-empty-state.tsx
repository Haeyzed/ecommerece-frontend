"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useEmployees } from '@/features/hrm/employees'

export function EmployeesEmptyState() {
  const { setOpen } = useEmployees()

  return (
    <DataTableEmptyState
      title="No employees yet"
      description="You haven't created any employees yet. Get started by creating your first employee."
      primaryAction={{
        label: "Add Employee",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Import Employees",
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