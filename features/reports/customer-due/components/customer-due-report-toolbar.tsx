'use client'

import { useMemo } from 'react'
import { CancelIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type Table } from '@tanstack/react-table'
import { type DateRange } from 'react-day-picker'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { DateRangePicker } from '@/components/ui/date-picker'
import { useCustomers } from '@/features/people/customers/api'

type CustomerDueReportToolbarProps<TData> = {
  table: Table<TData>
}

export function CustomerDueReportToolbar<TData>({
  table,
}: CustomerDueReportToolbarProps<TData>) {
  const { data: customersResponse } = useCustomers({ per_page: 100 })
  const customers = customersResponse?.data ?? []
  const customerOptions = useMemo(
    () =>
      customers.map((c) => ({
        value: String(c.id),
        label: c.name ?? `Customer #${c.id}`,
        id: c.id,
      })),
    [customers]
  )

  const dateFromRaw = (table.getColumn('date_from')?.getFilterValue() as string) ?? ''
  const dateToRaw = (table.getColumn('date_to')?.getFilterValue() as string) ?? ''
  const customerIdRaw = (table.getColumn('customer_id')?.getFilterValue() as number | string) ?? ''

  const dateRange = useMemo((): DateRange | undefined => {
    const from = dateFromRaw ? parseISO(dateFromRaw) : undefined
    const to = dateToRaw ? parseISO(dateToRaw) : undefined
    if (!from && !to) return undefined
    return { from: from ?? undefined, to: to ?? undefined }
  }, [dateFromRaw, dateToRaw])

  const handleDateRangeChange = (range: DateRange | undefined) => {
    table.getColumn('date_from')?.setFilterValue(
      range?.from ? format(range.from, 'yyyy-MM-dd') : ''
    )
    table.getColumn('date_to')?.setFilterValue(
      range?.to ? format(range.to, 'yyyy-MM-dd') : ''
    )
  }

  const selectedCustomer = customerOptions.find(
    (o) => o.id === Number(customerIdRaw) || o.value === String(customerIdRaw)
  ) ?? null

  const isFiltered =
    dateFromRaw !== '' ||
    dateToRaw !== '' ||
    customerIdRaw !== '' ||
    customerIdRaw !== undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder="Date range"
          className="h-8 w-[200px] lg:w-[240px]"
        />
        <Combobox
          items={customerOptions}
          value={selectedCustomer}
          onValueChange={(option) =>
            table.getColumn('customer_id')?.setFilterValue(option?.id ?? '')
          }
          itemToStringValue={(item) => item?.label ?? ''}
        >
          <ComboboxInput
            placeholder="All customers"
            className="h-8 w-[160px] lg:w-[180px]"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No customers found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.getColumn('date_from')?.setFilterValue('')
              table.getColumn('date_to')?.setFilterValue('')
              table.getColumn('customer_id')?.setFilterValue('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <HugeiconsIcon icon={CancelIcon} className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
