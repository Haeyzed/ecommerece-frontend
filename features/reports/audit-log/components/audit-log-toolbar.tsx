'use client'

import { CancelIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table'
import { DataTableTableViewOptions } from '@/components/data-table'

const EVENT_OPTIONS = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Deleted', value: 'deleted' },
  { label: 'Restored', value: 'restored' },
]

type AuditLogToolbarProps<TData> = {
  table: Table<TData>
}

export function AuditLogToolbar<TData>({ table }: AuditLogToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
        <Input
          placeholder="Model"
          value={
            (table.getColumn('auditable_type')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('auditable_type')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[140px]"
        />
        <Input
          placeholder="IP address"
          value={
            (table.getColumn('ip_address')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('ip_address')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[140px]"
        />
        <Input
          placeholder="User"
          value={
            (table.getColumn('user')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('user')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[140px]"
        />
        <div className="flex gap-x-2">
          <DataTableFacetedFilter
            column={table.getColumn('event')}
            title="Event"
            options={EVENT_OPTIONS}
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <HugeiconsIcon icon={CancelIcon} className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableTableViewOptions table={table} />
    </div>
  )
}
