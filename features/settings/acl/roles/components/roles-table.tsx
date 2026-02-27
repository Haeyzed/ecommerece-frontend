"use client"

import { useState, useMemo, useEffect, Fragment } from 'react'
import { format } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { DataTablePagination, DataTableSkeleton, DataTableToolbar } from '@/components/data-table'
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
  useReactTable, type ExpandedState,
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { usePaginatedRoles } from '@/features/settings/acl/roles/api'
import {
  RolesEmptyState,
  DataTableBulkActions,
  rolesColumns as columns, Role, RoleExpandedContent,
} from '@/features/settings/acl/roles'
import { type Audit, AuditLogExpandedContent } from '@/features/reports/audit-log'

export function RolesTable() {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'name', searchKey: 'search', type: 'string' },
      { columnId: 'active_status', searchKey: 'status', type: 'array' },
    ],
  })

  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    const nameFilter = columnFilters.find((f) => f.id === 'name')
    const statusFilter = columnFilters.find((f) => f.id === 'active_status')

    let statusValue: string | undefined = undefined
    if (statusFilter?.value && Array.isArray(statusFilter.value)) {
      if (statusFilter.value.length === 1) {
        statusValue = statusFilter.value[0]
      }
    }

    return {
      page,
      per_page: perPage,
      search: nameFilter?.value as string | undefined,
      is_active: statusValue === 'active' ? true : statusValue === 'inactive' ? false : undefined,
      start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }
  }, [pagination, columnFilters, dateRange])

  const { data, isLoading, error } = usePaginatedRoles(apiParams)

  const pageCount = useMemo(() => {
    if (!data?.meta) return 0
    return Math.ceil((data.meta.total || 0) / (data.meta.per_page || 10))
  }, [data?.meta])

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
      expanded
    },
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    if (pageCount > 0) {
      ensurePageInRange(pageCount)
    }
  }, [pageCount, ensurePageInRange])

  if (error) {
    return toast.error(error.message)
  }

  const hasData = data?.meta?.total && data.meta.total > 0
  const isFiltered = !!apiParams.search || !!apiParams.is_active || !!apiParams.start_date
  if (!isLoading && !hasData && !isFiltered) {
    return <RolesEmptyState />
  }

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter by name...'
        searchKey='name'
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onReset={() => setDateRange(undefined)}
        filters={[
          {
            columnId: 'active_status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        (header.column.columnDef.meta as any)?.className,
                        (header.column.columnDef.meta as any)?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <DataTableSkeleton columnCount={columns.length} />
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
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
                          (cell.column.columnDef.meta as any)?.className,
                          (cell.column.columnDef.meta as any)?.tdClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell
                          colSpan={columns.length}
                          className="p-4"
                        >
                          <RoleExpandedContent role={row.original as Role} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} />
    </div>
  )
}