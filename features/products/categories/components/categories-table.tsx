"use client"

/**
 * CategoriesTable
 *
 * The main table component for displaying categories.
 * Handles server-side pagination, sorting, filtering, and data fetching
 * via the URL state hook and TanStack Table.
 *
 * @component
 */

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
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useCategories } from '../api'
import { categoriesColumns as columns } from './categories-columns'
import { CategoriesEmptyState } from './categories-empty-state'
import { DataTableBulkActions } from './data-table-bulk-actions'

export function CategoriesTable() {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Synced with URL states
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
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'featured_status', searchKey: 'featured_status', type: 'array' },
      { columnId: 'sync_status', searchKey: 'sync_status', type: 'array' },
    ],
  })

  // Extract API params from URL and column filters
  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    
    // Extract filter objects
    const nameFilter = columnFilters.find((f) => f.id === 'name')
    const statusFilter = columnFilters.find((f) => f.id === 'status')
    const featuredStatusFilter = columnFilters.find((f) => f.id === 'featured_status')
    const syncStatusFilter = columnFilters.find((f) => f.id === 'sync_status')

    // Helper to extract single value from array filter
    const getFilterValue = (filter: typeof statusFilter) => {
      if (filter?.value && Array.isArray(filter.value) && filter.value.length === 1) {
        return filter.value[0]
      }
      return undefined
    }

    return {
      page,
      per_page: perPage,
      search: nameFilter?.value as string | undefined,
      status: getFilterValue(statusFilter),
      featured_status: getFilterValue(featuredStatusFilter),
      sync_status: getFilterValue(syncStatusFilter),
    }
  }, [pagination, columnFilters])

  // Fetch data from API
  const { data, isLoading, error } = useCategories(apiParams)

  // Calculate pagination info from API response
  const pageCount = useMemo(() => {
    if (!data?.meta) return 0
    return Math.ceil((data.meta.total || 0) / (data.meta.per_page || 10))
  }, [data?.meta])

  // eslint-disable-next-line react-hooks/incompatible-library
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
    manualPagination: true, // Server-side pagination
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
    return (
      toast.error(error.message)
    )
  }

  // Show empty state if no data (check total from pagination)
  const hasData = data?.meta?.total && data.meta.total > 0
  if (!isLoading && !hasData) {
    return <CategoriesEmptyState />
  }

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter categories...'
        searchKey='name'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
          {
            columnId: 'featured_status',
            title: 'Featured',
            options: [
              { label: 'Featured', value: 'featured' },
              { label: 'Not Featured', value: 'not featured' },
            ],
          },
          {
            columnId: 'sync_status',
            title: 'Sync',
            options: [
              { label: 'Enabled', value: 'enabled' },
              { label: 'Disabled', value: 'disabled' },
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