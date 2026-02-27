'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'

import {
  useCreateOvertime,
  useUpdateOvertime
} from '@/features/hrm/overtimes/api'
import { overtimeSchema, type OvertimeFormData } from '@/features/hrm/overtimes/schemas'
import { type Overtime } from '../types'
import { useOptionEmployees } from '@/features/hrm/employees/api'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Spinner } from '@/components/ui/spinner'
import { DatePicker } from '@/components/date-picker'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type OvertimesActionDialogProps = {
  currentRow?: Overtime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OvertimesActionDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: OvertimesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createOvertime, isPending: isCreating } = useCreateOvertime()
  const { mutate: updateOvertime, isPending: isUpdating } = useUpdateOvertime()
  const isLoading = isCreating || isUpdating

  const form = useForm<OvertimeFormData>({
    resolver: zodResolver(overtimeSchema),
    defaultValues: isEdit && currentRow
      ? {
        employee_id: currentRow.employee_id,
        date: currentRow.date,
        hours: currentRow.hours,
        rate: currentRow.rate,
        status: currentRow.status,
      }
      : {
        employee_id: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        hours: 0,
        rate: 0,
        status: 'pending',
      },
  })

  const onSubmit = (values: OvertimeFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateOvertime({ id: currentRow.id, data: values }, options)
    } else {
      createOvertime(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Overtime' : 'Add New Overtime'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the overtime details here. ' : 'Create a new overtime record here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <OvertimeForm form={form} onSubmit={onSubmit} id='overtime-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='overtime-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className='mr-2 size-4' />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Overtime' : 'Add New Overtime'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the overtime details here. ' : 'Create a new overtime record here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <OvertimeForm form={form} onSubmit={onSubmit} id='overtime-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='overtime-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className='mr-2 size-4' />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface OvertimeFormProps {
  form: UseFormReturn<OvertimeFormData>
  onSubmit: (data: OvertimeFormData) => void
  id: string
  className?: string
}

function OvertimeForm({ form, onSubmit, id, className }: OvertimeFormProps) {
  const { data: optionEmployees } = useOptionEmployees()

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>

        {/* Employee Selection */}
        <Controller
          control={form.control}
          name='employee_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className="flex flex-col">
              <FieldLabel htmlFor='overtime-employee-id'>Employee <span className="text-destructive">*</span></FieldLabel>
              <Combobox
                items={optionEmployees || []}
                itemToStringLabel={(item) => item.label}
                value={(optionEmployees || []).find((p) => Number(p.value) === field.value) ?? null}
                onValueChange={(item) => {
                  field.onChange(item?.value ? Number(item.value) : 0)
                }}
                isItemEqualToValue={(a, b) => Number(a?.value) === Number(b?.value)}
              >
                <ComboboxInput
                  id="overtime-employee-id"
                  name="overtime-employee-id"
                  placeholder="Select employee..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No employee found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Date */}
        <Controller
          control={form.control}
          name='date'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className="flex flex-col">
              <FieldLabel>Date <span className="text-destructive">*</span></FieldLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Pick a date"
                error={fieldState.error?.message}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Hours */}
          <Controller
            control={form.control}
            name='hours'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='overtime-hours'>Hours <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='overtime-hours'
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g. 2.5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Rate */}
          <Controller
            control={form.control}
            name='rate'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='overtime-rate'>Rate <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='overtime-rate'
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 15.50"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Status */}
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

      </FieldGroup>
    </form>
  )
}