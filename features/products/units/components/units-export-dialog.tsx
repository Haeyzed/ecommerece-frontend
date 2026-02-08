'use client'

/**
 * UnitsExportDialog
 *
 * Dialog/drawer component for exporting units to Excel or PDF.
 * Supports download or email delivery.
 */

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'

import { useUnitsExport } from '@/features/products/units/api'
import { unitExportSchema, type UnitExportFormData } from '@/features/products/units/schemas'

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

const AVAILABLE_COLUMNS = [
  { value: 'id', label: 'ID' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'base_unit_name', label: 'Base Unit' },
  { value: 'operator', label: 'Operator' },
  { value: 'operation_value', label: 'Operation Value' },
  { value: 'is_active', label: 'Status' },
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Updated' },
] as const

type UnitsExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function UnitsExportDialog({
  open,
  onOpenChange,
  ids = [],
}: UnitsExportDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: exportUnits, isPending } = useUnitsExport()
  const { api } = useApiClient()

  const form = useForm<UnitExportFormData>({
    resolver: zodResolver(unitExportSchema),
    defaultValues: {
      format: 'excel',
      method: 'download',
      columns: ['id', 'code', 'name', 'is_active'],
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

  const users = usersResponse?.data ?? []

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  const onSubmit = (data: UnitExportFormData) => {
    exportUnits(
      {
        ids: ids.length > 0 ? ids : undefined,
        format: data.format,
        method: data.method,
        columns: data.columns,
        user_id: data.method === 'email' ? data.user_id : undefined,
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

  const ExportContent = () => (
    <form id="export-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <FieldGroup>
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
            <DialogTitle>Export Units</DialogTitle>
            <DialogDescription>
              Select export format, method, and columns. {ids.length > 0 && `${ids.length} unit(s) selected.`}
            </DialogDescription>
          </DialogHeader>

          <ExportContent />

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
          <DrawerTitle>Export Units</DrawerTitle>
          <DrawerDescription>
            Select export format, method, and columns. {ids.length > 0 && `${ids.length} unit(s) selected.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">
          <ExportContent />
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
