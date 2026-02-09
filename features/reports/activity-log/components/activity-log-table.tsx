'use client'

import {
  DataTablePagination,
  DataTableSkeleton,
  DataTableToolbar,
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
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAudits } from '@/features/reports/activity-log/api'
import { ActivityLogEmptyState } from './activity-log-empty-state'
import { auditColumns as columns } from './activity-log-columns'

export function ActivityLogTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const { columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      pagination: { defaultPage: 1, defaultPageSize: 10 },
      globalFilter: { enabled: false },
      columnFilters: [{ columnId: 'auditable_type', searchKey: 'search', type: 'string' }],
    })

  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    const searchFilter = columnFilters.find((f) => f.id === 'auditable_type')
    return {
      page,
      per_page: perPage,
      search: searchFilter?.value as string | undefined,
    }
  }, [pagination, columnFilters])

  const { data, isLoading, error } = useAudits(apiParams)

  const pageCount = useMemo(() => {
    if (!data?.meta) return 0
    return Math.ceil((data.meta.total || 0) / (data.meta.per_page || 10))
  }, [data?.meta])

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount,
    state: { sorting, pagination, columnFilters, columnVisibility },
    enableRowSelection: false,
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
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
  const isFiltered = !!apiParams.search
  if (!isLoading && !hasData && !isFiltered) return <ActivityLogEmptyState />

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter audits...'
        searchKey='auditable_type'
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className='group/row'
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
