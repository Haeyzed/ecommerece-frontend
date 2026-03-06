'use client'

import { useEffect, useMemo, useState } from 'react'

import { format } from 'date-fns'

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

import { type DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { useTableUrlState } from '@/hooks/use-table-url-state'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DataTablePagination,
  DataTableSkeleton,
  DataTableToolbar,
} from '@/components/data-table'

import {
  DataTableBulkActions,
  EmployeesEmptyState,
  employeesColumns as columns,
} from '@/features/hrm/employees'
import { useOptionEmployees, usePaginatedEmployees } from '@/features/hrm/employees/api'
import { useOptionDepartments } from '@/features/hrm/departments/api'
import { useOptionShifts } from '@/features/hrm/shifts/api'
import { useOptionCountries } from '@/features/settings/countries/api'
import { useOptionStates } from '@/features/settings/states/api'
import { useOptionCities } from '@/features/settings/cities/api'
import { useOptionEmploymentTypes } from '@/features/hrm/employment-types'
import { useOptionDesignations } from '@/features/hrm/designations/api'

export function EmployeesTable() {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const { data: departments } = useOptionDepartments()
  const { data: shifts } = useOptionShifts()
  const { data: countries } = useOptionCountries()
  const { data: states } = useOptionStates()
  const { data: cities } = useOptionCities()
  const { data: employmentTypes } = useOptionEmploymentTypes()
  const { data: designations } = useOptionDesignations()
  const { data: employees } = useOptionEmployees()

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
      { columnId: 'department_id', searchKey: 'department', type: 'array' },
      { columnId: 'designation_id', searchKey: 'designation', type: 'array' },
      { columnId: 'employment_type_id', searchKey: 'type', type: 'array' },
      { columnId: 'reporting_manager_id', searchKey: 'manager', type: 'array' },
      { columnId: 'shift_id', searchKey: 'shift', type: 'array' },
      { columnId: 'country_id', searchKey: 'country', type: 'array' },
      { columnId: 'state_id', searchKey: 'state', type: 'array' },
      { columnId: 'city_id', searchKey: 'city', type: 'array' },
    ],
  })

  const apiParams = useMemo(() => {
    const page = pagination.pageIndex + 1
    const perPage = pagination.pageSize
    const nameFilter = columnFilters.find((f) => f.id === 'name')
    const statusFilter = columnFilters.find((f) => f.id === 'active_status')
    const departmentFilter = columnFilters.find((f) => f.id === 'department_id')
    const designationFilter = columnFilters.find((f) => f.id === 'designation_id')
    const typeFilter = columnFilters.find((f) => f.id === 'employment_type_id')
    const managerFilter = columnFilters.find((f) => f.id === 'reporting_manager_id')
    const shiftFilter = columnFilters.find((f) => f.id === 'shift_id')
    const countryFilter = columnFilters.find((f) => f.id === 'country_id')
    const stateFilter = columnFilters.find((f) => f.id === 'state_id')
    const cityFilter = columnFilters.find((f) => f.id === 'city_id')

    let statusValue: string | undefined = undefined
    if (statusFilter?.value && Array.isArray(statusFilter.value)) {
      if (statusFilter.value.length === 1) {
        statusValue = statusFilter.value[0]
      }
    }

    const getFilterValue = (filter: any) => {
        if (filter?.value && Array.isArray(filter.value) && filter.value.length > 0) {
            return Number(filter.value[0])
        }
        return undefined
    }

    return {
      page,
      per_page: perPage,
      search: nameFilter?.value as string | undefined,
      is_active:
        statusValue === 'active'
          ? true
          : statusValue === 'inactive'
            ? false
            : undefined,
      department_id: getFilterValue(departmentFilter),
      designation_id: getFilterValue(designationFilter),
      employment_type_id: getFilterValue(typeFilter),
      reporting_manager_id: getFilterValue(managerFilter),
      shift_id: getFilterValue(shiftFilter),
      country_id: getFilterValue(countryFilter),
      state_id: getFilterValue(stateFilter),
      city_id: getFilterValue(cityFilter),
      start_date: dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : undefined,
      end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }
  }, [pagination, columnFilters, dateRange])

  const { data, isLoading, error } = usePaginatedEmployees(apiParams)

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
  const isFiltered =
    !!apiParams.search ||
    !!apiParams.is_active ||
    !!apiParams.start_date ||
    !!apiParams.department_id ||
    !!apiParams.designation_id ||
    !!apiParams.employment_type_id ||
    !!apiParams.reporting_manager_id ||
    !!apiParams.shift_id ||
    !!apiParams.country_id ||
    !!apiParams.state_id ||
    !!apiParams.city_id

  if (!isLoading && !hasData && !isFiltered) {
    return <EmployeesEmptyState />
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
          {
            columnId: 'department_id',
            title: 'Department',
            options: departments?.map((d) => ({ label: d.label, value: String(d.value) })) || [],
          },
          {
            columnId: 'designation_id',
            title: 'Designation',
            options: designations?.map((d) => ({ label: d.label, value: String(d.value) })) || [],
          },
          {
            columnId: 'employment_type_id',
            title: 'Type',
            options: employmentTypes?.map((t) => ({ label: t.label, value: String(t.value) })) || [],
          },
          {
            columnId: 'reporting_manager_id',
            title: 'Manager',
            options: employees?.map((e) => ({ label: e.label, value: String(e.value) })) || [],
          },
          {
            columnId: 'shift_id',
            title: 'Shift',
            options: shifts?.map((s) => ({ label: s.label, value: String(s.value) })) || [],
          },
          {
            columnId: 'country_id',
            title: 'Country',
            options: countries?.map((c) => ({ label: c.label, value: String(c.value) })) || [],
          },
          {
            columnId: 'state_id',
            title: 'State',
            options: states?.map((s) => ({ label: s.label, value: String(s.value) })) || [],
          },
          {
            columnId: 'city_id',
            title: 'City',
            options: cities?.map((c) => ({ label: c.label, value: String(c.value) })) || [],
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
