'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { format } from 'date-fns'

import { useDepartmentsExport } from '@/features/hrm/departments/api'
import { departmentExportSchema, type DepartmentExportFormData } from '@/features/hrm/departments/schemas'

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

const AVAILABLE_COLUMNS = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'is_active', label: 'Status' },
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Updated' },
] as const

type DepartmentsExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function DepartmentsExportDialog({
                                          open,
                                          onOpenChange,
                                          ids = [],
                                        }: DepartmentsExportDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: exportDepartments, isPending } = useDepartmentsExport()
  const { api } = useApiClient()

  const form = useForm<DepartmentExportFormData>({
    resolver: zodResolver(departmentExportSchema),
    defaultValues: {
      format: 'excel',
      method: 'download',
      columns: ['id', 'name', 'is_active'],
      start_date: undefined,
      end_date: undefined,
    },
  })

  const method = form.watch('method')
  const startDate = form.watch('start_date')
  const endDate = form.watch('end_date')

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

  const onSubmit = (data: DepartmentExportFormData) => {
    exportDepartments(
      {
        ids: ids.length > 0 ? ids : undefined,
        format: data.format,
        method: data.method,
        columns: data.columns,
        user_id: data.method === 'email' ? data.user_id : undefined,
        start_date: data.start_date,
        end_date: data.end_date,
      },
      {
        onSuccess: () => handleOpenChange(false),
      }
    )
  }

  const handleSelectAllColumns = () => {
    form.setValue('columns', AVAILABLE_COLUMNS.map((c) => c.value))
  }

  const handleDeselectAllColumns = () => {
    form.setValue('columns', [])
  }

  const exportFormContent = (
    <form id="export-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="start_date"
          render={({ fieldState }) => (
            <Field className="grid gap-1.5 w-full">
              <FieldLabel>Date Range</FieldLabel>
              <DateRangePicker
                value={{
                  from: startDate ? new Date(startDate) : undefined,
                  to: endDate ? new Date(endDate) : undefined,
                }}
                onChange={(range) => {
                  form.setValue(
                    'start_date',
                    range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
                    { shouldValidate: true, shouldDirty: true }
                  )
                  form.setValue(
                    'end_date',
                    range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
                    { shouldValidate: true, shouldDirty: true }
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
                  <label htmlFor="format-excel" className="text-sm font-medium cursor-pointer">
                    Excel (XLSX)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <label htmlFor="format-pdf" className="text-sm font-medium cursor-pointer">
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
                  <label htmlFor="method-download" className="text-sm font-medium cursor-pointer">
                    Download
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="method-email" />
                  <label htmlFor="method-email" className="text-sm font-medium cursor-pointer">
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
                <FieldDescription>Select a user to receive the export file via email</FieldDescription>
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
              <div className="grid grid-cols-2 gap-3 rounded-md border p-3 max-h-60 overflow-y-auto">
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
                      className="text-sm font-medium cursor-pointer"
                    >
                      {column.label}
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start">
            <DialogTitle>Export Departments</DialogTitle>
            <DialogDescription>
              Select export format, method, and columns. {ids.length > 0 && `${ids.length} department(s) selected.`}
            </DialogDescription>
          </DialogHeader>

          {exportFormContent}

          <DialogFooter className="gap-y-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="export-form"
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
          <DrawerTitle>Export Departments</DrawerTitle>
          <DrawerDescription>
            Select export format, method, and columns. {ids.length > 0 && `${ids.length} department(s) selected.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">
          {exportFormContent}
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            form="export-form"
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