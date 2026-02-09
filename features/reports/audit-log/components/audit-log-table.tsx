'use client'

import { Fragment } from 'react'
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
  type ExpandedState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAudits } from '@/features/reports/audit-log/api'
import type { Audit } from '@/features/reports/audit-log/types'
import { AuditLogEmptyState } from './audit-log-empty-state'
import { AuditLogToolbar } from './audit-log-toolbar'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { auditColumns as columns, AuditLogExpandedContent } from './audit-log-columns'

export function AuditLogTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    date_from: false,
    date_to: false,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      pagination: { defaultPage: 1, defaultPageSize: 10 },
      globalFilter: { enabled: false },
      columnFilters: [
        { columnId: 'auditable_type', searchKey: 'auditable_type', type: 'string' },
        { columnId: 'event', searchKey: 'event', type: 'array' },
        { columnId: 'ip_address', searchKey: 'ip_address', type: 'string' },
        { columnId: 'user', searchKey: 'user', type: 'string' },
        { columnId: 'date_from', searchKey: 'date_from', type: 'string' },
        { columnId: 'date_to', searchKey: 'date_to', type: 'string' },
      ],
    })

  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    const auditableTypeFilter = columnFilters.find((f) => f.id === 'auditable_type')
    const eventFilter = columnFilters.find((f) => f.id === 'event')
    const ipFilter = columnFilters.find((f) => f.id === 'ip_address')
    const userFilter = columnFilters.find((f) => f.id === 'user')
    const dateFromFilter = columnFilters.find((f) => f.id === 'date_from')
    const dateToFilter = columnFilters.find((f) => f.id === 'date_to')
    const eventValue = eventFilter?.value && Array.isArray(eventFilter.value)
      ? (eventFilter.value.length === 1 ? eventFilter.value[0] : undefined)
      : undefined
    return {
      page,
      per_page: perPage,
      auditable_type: auditableTypeFilter?.value as string | undefined,
      event: eventValue as 'created' | 'updated' | 'deleted' | 'restored' | undefined,
      ip_address: ipFilter?.value as string | undefined,
      user: userFilter?.value as string | undefined,
      date_from: dateFromFilter?.value as string | undefined,
      date_to: dateToFilter?.value as string | undefined,
    }
  }, [pagination, columnFilters])

  const { data, isLoading, error } = useAudits(apiParams)

  const pageCount = useMemo(() => {
    if (!data?.meta) return 0
    return Math.ceil((data.meta.total || 0) / (data.meta.per_page || 10))
  }, [data?.meta])

  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount,
    state: { sorting, pagination, rowSelection, columnFilters, columnVisibility, expanded },
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    if (pageCount > 0) ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  if (error) toast.error(error.message)

  const hasData = data?.meta?.total && data.meta.total > 0
  const isFiltered =
    !!apiParams.auditable_type ||
    !!apiParams.event ||
    !!apiParams.ip_address ||
    !!apiParams.user ||
    !!apiParams.date_from ||
    !!apiParams.date_to
  if (!isLoading && !hasData && !isFiltered) return <AuditLogEmptyState />

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <AuditLogToolbar table={table} />
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
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      (header.column.columnDef.meta as { className?: string })?.className,
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
          {isLoading ? (
            <DataTableSkeleton columnCount={columns.length} />
          ) : (
            <TableBody>
              {table.getExpandedRowModel().rows?.length ? (
                table.getExpandedRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      className="group/row"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                            (cell.column.columnDef.meta as { className?: string })?.className,
                            (cell.column.columnDef.meta as { tdClassName?: string })?.tdClassName
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell
                          colSpan={columns.length}
                          className="p-4"
                        >
                          <AuditLogExpandedContent audit={row.original as Audit} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  )
}
