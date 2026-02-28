'use client'

import { type Table } from '@tanstack/react-table'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type PayrollRun } from '@/features/hrm/payroll/types'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as PayrollRun).id)

  if (selectedIds.length === 0) return null

  return (
    <BulkActionsToolbar table={table} entityName='payroll run'>
      <></>
    </BulkActionsToolbar>
  )
}
