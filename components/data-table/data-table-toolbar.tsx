"use client"

import { CancelIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from "@hugeicons/react"
import { type Table } from '@tanstack/react-table'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableTableViewOptions } from './data-table-view-options'
import { DateRangePicker } from '@/components/date-range-picker'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  onReset?: () => void
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
                                          table,
                                          searchPlaceholder = 'Filter...',
                                          searchKey,
                                          dateRange,
                                          onDateRangeChange,
                                          onReset,
                                          filters = [],
                                        }: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter ||
    !!dateRange?.from

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='h-8 w-full sm:w-[150px] lg:w-[250px]'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className='h-8 w-full sm:w-[150px] lg:w-[250px]'
          />
        )}

        {/* Render Date Range Picker */}
        {onDateRangeChange && (
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="h-8 w-full sm:w-fit"
          />
        )}

        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
              if (onReset) onReset()
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <HugeiconsIcon icon={CancelIcon} className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableTableViewOptions table={table} />
    </div>
  )
}