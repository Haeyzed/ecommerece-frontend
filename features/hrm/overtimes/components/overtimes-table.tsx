"use client"

import { useState, useMemo, useEffect } from 'react'
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
  useReactTable
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { usePaginatedOvertimes } from '@/features/hrm/overtimes/api'
import {
  OvertimesEmptyState,
  DataTableBulkActions,
  overtimesColumns as columns
} from '@/features/hrm/overtimes'
import { useOptionEmployees } from '@/features/hrm/employees/api'
import { DateRangePicker } from '@/components/date-range-picker'

export function OvertimesTable() {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const { data: optionEmployees } = useOptionEmployees()

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
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'employee_id', searchKey: 'employee_id', type: 'string' },
    ],
  })

  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    const statusFilter = columnFilters.find((f) => f.id === 'status')
    const employeeFilter = columnFilters.find((f) => f.id === 'employee_id')

    let statusValue: string | undefined = undefined
    if (statusFilter?.value && Array.isArray(statusFilter.value)) {
      if (statusFilter.value.length === 1) {
        statusValue = statusFilter.value[0]
      }
    }

    return {
      page,
      per_page: perPage,
      status: statusValue as any,
      employee_id: employeeFilter?.value ? Number(employeeFilter.value) : undefined,
      start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }
  }, [pagination, columnFilters, dateRange])

  const { data, isLoading, error } = usePaginatedOvertimes(apiParams)

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
    },
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
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
  const isFiltered = !!apiParams.status || !!apiParams.employee_id || !!apiParams.start_date

  if (!isLoading && !hasData && !isFiltered) {
    return <OvertimesEmptyState />
  }

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onReset={() => setDateRange(undefined)}
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ],
          },
          {
            columnId: 'employee_id',
            title: 'Employee',
            options: optionEmployees?.map(emp => ({ label: emp.label, value: emp.value.toString() })) || [],
          }
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