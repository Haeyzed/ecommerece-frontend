"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { usePayroll } from '@/features/hrm/payroll'

export function PayrollEmptyState() {
  const { setOpen } = usePayroll()

  return (
    <DataTableEmptyState
      title="No payroll runs yet"
      description="Create a payroll run for a month to generate and manage payslips. Get started by adding a new payroll run."
      primaryAction={{
        label: "New payroll run",
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
      }}
      learnMoreLink={{
        href: "#",
        label: "Learn more",
      }}
    />
  )
}
