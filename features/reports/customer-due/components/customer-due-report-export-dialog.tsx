'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { useSearchParams } from 'next/navigation'
import { useCustomerDueReportExport } from '@/features/reports/customer-due/api'
import {
  customerDueReportExportSchema,
  type CustomerDueReportExportFormData,
} from '@/features/reports/customer-due/schemas'
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

const AVAILABLE_COLUMNS = [
  { value: 'date', label: 'Date' },
  { value: 'reference_no', label: 'Reference' },
  { value: 'customer_name', label: 'Customer Name' },
  { value: 'customer_phone', label: 'Customer Phone' },
  { value: 'grand_total', label: 'Grand Total' },
  { value: 'returned_amount', label: 'Returned Amount' },
  { value: 'paid', label: 'Paid' },
  { value: 'due', label: 'Due' },
] as const

type CustomerDueReportExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDueReportExportDialog({
  open,
  onOpenChange,
}: CustomerDueReportExportDialogProps) {
  const searchParams = useSearchParams()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: exportReport, isPending } = useCustomerDueReportExport()
  const { api } = useApiClient()

  const form = useForm<CustomerDueReportExportFormData>({
    resolver: zodResolver(customerDueReportExportSchema),
    defaultValues: {
      start_date: searchParams.get('date_from') ?? '',
      end_date: searchParams.get('date_to') ?? '',
      customer_id: searchParams.get('customer_id')
        ? Number(searchParams.get('customer_id'))
        : null,
      format: 'excel',
      method: 'download',
      columns: [
        'date',
        'reference_no',
        'customer_name',
        'customer_phone',
        'grand_total',
        'returned_amount',
        'paid',
        'due',
      ],
    },
  })

  const method = form.watch('method')

  useEffect(() => {
    if (open && searchParams.get('date_from') && searchParams.get('date_to')) {
      form.setValue('start_date', searchParams.get('date_from')!)
      form.setValue('end_date', searchParams.get('date_to')!)
      const cid = searchParams.get('customer_id')
      form.setValue('customer_id', cid ? Number(cid) : null)
    }
  }, [open, searchParams, form])

  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () =>
      api.get<Array<{ id: number; name: string; email: string }>>('/users', {
        params: { per_page: 100 },
      }),
    enabled: open && method === 'email',
  })

  const users = usersResponse?.data ?? []

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  const onSubmit = (data: CustomerDueReportExportFormData) => {
    exportReport(
      {
        start_date: data.start_date,
        end_date: data.end_date,
        customer_id: data.customer_id ?? undefined,
        format: data.format,
        method: data.method,
        columns: data.columns,
        user_id: data.method === 'email' ? data.user_id : undefined,
      },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  const handleSelectAllColumns = () => {
    form.setValue(
      'columns',
      AVAILABLE_COLUMNS.map((c) => c.value)
    )
  }

  const handleDeselectAllColumns = () => {
    form.setValue('columns', [])
  }

  const ExportContent = () => (
    <form
      id="customer-due-export-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="start_date"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="end_date"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>End Date</FieldLabel>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
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
                  onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger data-invalid={!!fieldState.error}>
                    <SelectValue placeholder="Select user to send email to" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                {AVAILABLE_COLUMNS.map((column) => (
                  <div key={column.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.value}`}
                      checked={field.value?.includes(column.value) ?? false}
                      onCheckedChange={(checked) => {
                        const current = field.value ?? []
                        if (checked) {
                          field.onChange([...current, column.value])
                        } else {
                          field.onChange(current.filter((c) => c !== column.value))
                        }
                      }}
                    />
                    <label
                      htmlFor={`column-${column.value}`}
                      className="cursor-pointer text-sm font-medium"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="text-start">
            <DialogTitle>Export Customer Due Report</DialogTitle>
            <DialogDescription>
              Export uses the current report date range and customer filter from the table. Select
              format, method, and columns.
            </DialogDescription>
          </DialogHeader>
          <ExportContent />
          <DialogFooter className="gap-y-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="customer-due-export-form"
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
          <DrawerTitle>Export Customer Due Report</DrawerTitle>
          <DrawerDescription>
            Export uses the current report filters. Select format, method, and columns.
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <ExportContent />
        </div>
        <DrawerFooter>
          <Button
            type="submit"
            form="customer-due-export-form"
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
