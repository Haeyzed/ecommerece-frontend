'use client'

import {
  DataTablePagination,
  DataTableSkeleton,
} from '@/components/data-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { cn } from '@/lib/utils'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useCustomerDueReport } from '@/features/reports/customer-due/api'
import type { CustomerDueReportRow } from '@/features/reports/customer-due/types'
import { type ColumnDef } from '@tanstack/react-table'
import { customerDueReportColumns } from './customer-due-report-columns'
import { CustomerDueReportToolbar } from './customer-due-report-toolbar'
import { CustomerDueReportEmptyState } from './customer-due-report-empty-state'

const filterColumns: ColumnDef<CustomerDueReportRow>[] = [
  { id: 'date_from', header: () => null, cell: () => null, enableHiding: true },
  { id: 'date_to', header: () => null, cell: () => null, enableHiding: true },
  { id: 'customer_id', header: () => null, cell: () => null, enableHiding: true },
]
const columns = [...filterColumns, ...customerDueReportColumns]

export function CustomerDueReportTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    date_from: false,
    date_to: false,
    customer_id: false,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      pagination: { defaultPage: 1, defaultPageSize: 15 },
      globalFilter: { enabled: false },
      columnFilters: [
        { columnId: 'date_from', searchKey: 'date_from', type: 'string' },
        { columnId: 'date_to', searchKey: 'date_to', type: 'string' },
        { columnId: 'customer_id', searchKey: 'customer_id', type: 'string' },
      ],
    })

  const apiParams = useMemo(() => {
    const dateFromFilter = columnFilters.find((f) => f.id === 'date_from')
    const dateToFilter = columnFilters.find((f) => f.id === 'date_to')
    const customerIdFilter = columnFilters.find((f) => f.id === 'customer_id')
    const startDate = (dateFromFilter?.value as string) ?? ''
    const endDate = (dateToFilter?.value as string) ?? ''
    const customerIdRaw = customerIdFilter?.value
    const customerId =
      customerIdRaw !== undefined && customerIdRaw !== ''
        ? Number(customerIdRaw)
        : null
    if (!startDate || !endDate) return null
    return {
      start_date: startDate,
      end_date: endDate,
      customer_id: customerId ?? undefined,
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
    }
  }, [pagination, columnFilters])

  const { rows, meta, isLoading, error } = useCustomerDueReport(apiParams)

  const pageCount = useMemo(() => {
    if (!meta) return 0
    return Math.ceil((meta.total || 0) / (meta.per_page || 15))
  }, [meta])

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    state: { sorting, pagination, columnFilters, columnVisibility },
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (pageCount > 0) ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  if (error) toast.error(error.message)

  const hasDates = !!apiParams?.start_date && !!apiParams?.end_date
  if (!hasDates) return <CustomerDueReportEmptyState />

  return (
    <div className="flex flex-1 flex-col gap-4">
      <CustomerDueReportToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted',
                      (header.column.columnDef.meta as { thClassName?: string })?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <DataTableSkeleton columnCount={columns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group/row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={(cell.column.columnDef.meta as { tdClassName?: string })?.tdClassName}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No due sales in this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
    </div>
  )
}
