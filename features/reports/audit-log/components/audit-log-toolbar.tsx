'use client'

import { CancelIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type Table } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { DataTableFacetedFilter } from '@/components/data-table'
import { DataTableTableViewOptions } from '@/components/data-table'
import { useAuditableModels } from '@/features/reports/audit-log/api'
import { useApiClient } from '@/lib/api/api-client-client'

const EVENT_OPTIONS = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Deleted', value: 'deleted' },
  { label: 'Restored', value: 'restored' },
]

type AuditLogToolbarProps<TData> = {
  table: Table<TData>
}

export function AuditLogToolbar<TData>({ table }: AuditLogToolbarProps<TData>) {
  const { api, sessionStatus } = useApiClient()
  const { data: modelOptions = [] } = useAuditableModels()
  const { data: usersResponse } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () =>
      api.get<Array<{ id: number; name: string; email: string }>>('/users', {
        params: { per_page: 100 },
      }),
    enabled: sessionStatus !== 'loading',
  })
  const users = usersResponse?.data ?? []

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  const modelFilter = (table.getColumn('auditable_type')?.getFilterValue() as string) ?? ''
  const userFilter = (table.getColumn('user')?.getFilterValue() as string) ?? ''

  const userOptions = users.map((u) => ({ value: u.name, label: u.name }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
        <Combobox
          items={modelOptions}
          value={modelOptions.find((m) => m.value === modelFilter) ?? null}
          onValueChange={(option) =>
            table.getColumn('auditable_type')?.setFilterValue(option?.value ?? '')
          }
          itemToStringValue={(item) => item?.label ?? ''}
        >
          <ComboboxInput
            placeholder="Model"
            className="h-8 w-[120px] lg:w-[140px]"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No model found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Input
          placeholder="IP address"
          value={
            (table.getColumn('ip_address')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('ip_address')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[140px]"
        />

        <Combobox
          items={userOptions}
          value={userOptions.find((u) => u.value === userFilter) ?? null}
          onValueChange={(option) =>
            table.getColumn('user')?.setFilterValue(option?.value ?? '')
          }
          itemToStringValue={(item) => item?.label ?? ''}
        >
          <ComboboxInput
            placeholder="User"
            className="h-8 w-[120px] lg:w-[140px]"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No user found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <div className="flex gap-x-2">
          <DataTableFacetedFilter
            column={table.getColumn('event')}
            title="Event"
            options={EVENT_OPTIONS}
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <HugeiconsIcon icon={CancelIcon} className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableTableViewOptions table={table} />
    </div>
  )
}
