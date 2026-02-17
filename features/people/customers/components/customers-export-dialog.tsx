'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { useCustomersExport } from '../api'
import { customerExportSchema, type CustomerExportFormData } from '../schemas'
import { CUSTOMER_EXPORT_COLUMNS } from '../constants'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/lib/api/api-client-client'
import { Spinner } from '@/components/ui/spinner'
import { DateRangePicker } from '@/components/date-range-picker'
import { format } from 'date-fns'

const AVAILABLE_COLUMNS = CUSTOMER_EXPORT_COLUMNS.map((value) => ({
  value,
  label: value.replace(/_/g, ' '),
}))

type CustomersExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function CustomersExportDialog({
  open,
  onOpenChange,
  ids = [],
}: CustomersExportDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: exportCustomers, isPending } = useCustomersExport()
  const { api } = useApiClient()

  const form = useForm<CustomerExportFormData>({
    resolver: zodResolver(customerExportSchema),
    defaultValues: {
      format: 'excel',
      method: 'download',
      columns: ['name', 'company_name', 'email', 'phone_number', 'is_active'],
      start_date: undefined,
      end_date: undefined,
    },
  })

  const method = form.watch('method')

  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () =>
      api.get<Array<{ id: number; name: string; email: string }>>('/users', {
        params: { per_page: 100 },
      }),
    enabled: open && method === 'email',
  })

  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  const onSubmit = (data: CustomerExportFormData) => {
    exportCustomers(
      {
        ids: ids.length > 0 ? ids : undefined,
        format: data.format,
        method: data.method,
        columns: data.columns,
        user_id: data.method === 'email' ? data.user_id : undefined,
        start_date: data.start_date,
        end_date: data.end_date,
      },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  const handleSelectAllColumns = () => {
    form.setValue('columns', [...CUSTOMER_EXPORT_COLUMNS])
  }

  const handleDeselectAllColumns = () => {
    form.setValue('columns', [])
  }

  const content = (
    <form
      id="customers-export-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="start_date"
          render={({ fieldState }) => (
            <Field className="grid w-full gap-1.5">
              <FieldLabel>Date Range</FieldLabel>
              <DateRangePicker
                value={{
                  from: form.watch('start_date')
                    ? new Date(form.watch('start_date')!)
                    : undefined,
                  to: form.watch('end_date')
                    ? new Date(form.watch('end_date')!)
                    : undefined,
                }}
                onChange={(range) => {
                  form.setValue(
                    'start_date',
                    range?.from ? format(range.from, 'yyyy-MM-dd') : undefined
                  )
                  form.setValue(
                    'end_date',
                    range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
                  )
                }}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="format"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Export Format</FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <label htmlFor="format-excel" className="cursor-pointer text-sm font-medium">
                    Excel (XLSX)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <label htmlFor="format-pdf" className="cursor-pointer text-sm font-medium">
                    PDF
                  </label>
                </div>
              </RadioGroup>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="method"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Export Method</FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value === 'download') form.setValue('user_id', undefined)
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="download" id="method-download" />
                  <label htmlFor="method-download" className="cursor-pointer text-sm font-medium">
                    Download
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="method-email" />
                  <label htmlFor="method-email" className="cursor-pointer text-sm font-medium">
                    Send via Email
                  </label>
                </div>
              </RadioGroup>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {method === 'email' && (
          <Controller
            control={form.control}
            name="user_id"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Select User</FieldLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger data-invalid={!!fieldState.error}>
                    <SelectValue placeholder="Select user to send email to" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        <div className="flex flex-col">
                          <span className="font-medium">{u.name}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Select a user to receive the export file via email
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          control={form.control}
          name="columns"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Select Columns</FieldLabel>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={handleSelectAllColumns}>
                    Select All
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleDeselectAllColumns}>
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto rounded-md border p-3">
                {AVAILABLE_COLUMNS.map((col) => (
                  <div key={col.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`col-${col.value}`}
                      checked={field.value?.includes(col.value) ?? false}
                      onCheckedChange={(checked) => {
                        const current = field.value ?? []
                        if (checked) {
                          field.onChange([...current, col.value])
                        } else {
                          field.onChange(current.filter((c) => c !== col.value))
                        }
                      }}
                    />
                    <label htmlFor={`col-${col.value}`} className="cursor-pointer text-sm font-medium">
                      {col.label}
                    </label>
                  </div>
                ))}
              </div>
              <FieldDescription>Select the columns to include in the export</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )

  const description =
    ids.length > 0
      ? `Select export format, method, and columns. ${ids.length} customer(s) selected.`
      : 'Select export format, method, and columns.'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="text-start">
            <DialogTitle>Export Customers</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter className="gap-y-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="customers-export-form"
              disabled={isPending || (method === 'email' && isLoadingUsers)}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Exporting...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Upload01Icon} className="mr-2 size-4" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Export Customers</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">{content}</div>
        <DrawerFooter>
          <Button
            type="submit"
            form="customers-export-form"
            disabled={isPending || (method === 'email' && isLoadingUsers)}
          >
            {isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                Exporting...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Upload01Icon} className="mr-2 size-4" />
                Export
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
