'use client'

import { useMemo, useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DateRangePicker } from '@/components/ui/date-picker'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { DataTableSkeleton } from '@/components/data-table'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCustomerDueReport } from '@/features/reports/customer-due/api'
import { useCustomers } from '@/features/people/customers/api'
import { useApiClient } from '@/lib/api/api-client-client'

const defaultRange: DateRange = {
  from: subDays(new Date(), 30),
  to: new Date(),
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function CustomerDueReportClient() {
  const { sessionStatus } = useApiClient()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 15

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const reportParams = useMemo(
    () =>
      startDate && endDate
        ? {
            start_date: startDate,
            end_date: endDate,
            customer_id: customerId ?? undefined,
            page,
            per_page: perPage,
          }
        : null,
    [startDate, endDate, customerId, page, perPage]
  )

  const { rows, meta, isLoading, error, isSessionLoading } =
    useCustomerDueReport(reportParams)

  const { data: customersResponse } = useCustomers({
    per_page: 100,
  })
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
  const selectedCustomer = customerOptions.find(
    (o) => o.id === customerId
  ) ?? null

  const hasDates = !!startDate && !!endDate

  return (
    <AuthenticatedLayout>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customer Due Report
          </h2>
          <p className="text-muted-foreground">
            Unpaid sales in the selected date range. Filter by customer
            optionally.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={(range) => {
            setDateRange(range)
            setPage(1)
          }}
          placeholder="Date range"
          className="h-9 w-[260px]"
        />
        <Combobox
          items={customerOptions}
          value={selectedCustomer}
          onValueChange={(option) => {
            setCustomerId(option?.id ?? null)
            setPage(1)
          }}
          itemToStringValue={(item) => item?.label ?? ''}
        >
          <ComboboxInput
            placeholder="All customers"
            className="h-9 w-[200px]"
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
      </div>

      {!hasDates && (
        <p className="text-muted-foreground">
          Select a date range to run the report.
        </p>
      )}

      {hasDates && (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Grand total</TableHead>
                <TableHead className="text-right">Returned</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isSessionLoading ? (
                <DataTableSkeleton columnCount={7} />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-destructive">
                    {error.message}
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No due sales in this period.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.date
                        ? format(parseISO(row.date), 'dd/MM/yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell className="font-mono">{row.reference_no}</TableCell>
                    <TableCell>
                      <div>
                        <div>{row.customer_name}</div>
                        {row.customer_phone && (
                          <div className="text-muted-foreground text-sm">
                            {row.customer_phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(row.grand_total)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(row.returned_amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(row.paid)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatMoney(row.due)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {hasDates && meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total} rows.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
