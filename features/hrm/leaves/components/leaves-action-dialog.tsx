'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'

import {
  useCreateLeave,
  useUpdateLeave
} from '@/features/hrm/leaves/api'
import { leaveSchema, type LeaveFormData } from '@/features/hrm/leaves/schemas'
import { type Leave } from '../types'
import { useOptionEmployees } from '@/features/hrm/employees/api'
import { useOptionLeaveTypes } from '@/features/hrm/leave-types/api'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

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
import { Spinner } from '@/components/ui/spinner'
import { DateRangePicker } from '@/components/date-range-picker'
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

type LeavesActionDialogProps = {
  currentRow?: Leave
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeavesActionDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: LeavesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createLeave, isPending: isCreating } = useCreateLeave()
  const { mutate: updateLeave, isPending: isUpdating } = useUpdateLeave()
  const isLoading = isCreating || isUpdating

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: isEdit && currentRow
      ? {
        employee_id: currentRow.employee_id,
        leave_type_id: currentRow.leave_type_id,
        start_date: currentRow.start_date,
        end_date: currentRow.end_date,
        status: currentRow.status,
      }
      : {
        employee_id: 0,
        leave_type_id: 0,
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending',
      },
  })

  const onSubmit = (values: LeaveFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateLeave({ id: currentRow.id, data: values }, options)
    } else {
      createLeave(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Leave' : 'Add New Leave'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the leave details here. ' : 'Create a new leave request here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <LeaveForm form={form} onSubmit={onSubmit} id='leave-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='leave-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Leave' : 'Add New Leave'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the leave details here. ' : 'Create a new leave request here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <LeaveForm form={form} onSubmit={onSubmit} id='leave-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='leave-form' disabled={isLoading}>
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

interface LeaveFormProps {
  form: UseFormReturn<LeaveFormData>
  onSubmit: (data: LeaveFormData) => void
  id: string
  className?: string
}

function LeaveForm({ form, onSubmit, id, className }: LeaveFormProps) {
  const { data: optionEmployees } = useOptionEmployees()
  const { data: optionLeaveTypes } = useOptionLeaveTypes()

  const startDate = form.watch('start_date')
  const endDate = form.watch('end_date')

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
              <FieldLabel htmlFor='leave-employee-id'>Employee <span className="text-destructive">*</span></FieldLabel>
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
                  id="leave-employee-id"
                  name="leave-employee-id"
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

        {/* Leave Type Selection */}
        <Controller
          control={form.control}
          name='leave_type_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className="flex flex-col">
              <FieldLabel htmlFor='leave-type-id'>Leave Type <span className="text-destructive">*</span></FieldLabel>
              <Combobox
                items={optionLeaveTypes || []}
                itemToStringLabel={(item) => item.label}
                value={(optionLeaveTypes || []).find((p) => Number(p.value) === field.value) ?? null}
                onValueChange={(item) => {
                  field.onChange(item?.value ? Number(item.value) : 0)
                }}
                isItemEqualToValue={(a, b) => Number(a?.value) === Number(b?.value)}
              >
                <ComboboxInput
                  id="leave-type-id"
                  name="leave-type-id"
                  placeholder="Select leave type..."
                />
                <ComboboxContent>
                  <ComboboxEmpty>No leave type found.</ComboboxEmpty>
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

        <Field data-invalid={!!form.formState.errors.start_date || !!form.formState.errors.end_date} className="flex flex-col">
          <FieldLabel>Date Range <span className="text-destructive">*</span></FieldLabel>
          <DateRangePicker
            value={{
              from: startDate ? new Date(startDate) : undefined,
              to: endDate ? new Date(endDate) : undefined,
            }}
            onChange={(range) => {
              form.setValue('start_date', range?.from ? format(range.from, 'yyyy-MM-dd') : '', { shouldValidate: true })
              form.setValue('end_date', range?.to ? format(range.to, 'yyyy-MM-dd') : '', { shouldValidate: true })
            }}
            className="w-full"
          />
          {form.formState.errors.start_date && <FieldError errors={[form.formState.errors.start_date]} />}
          {form.formState.errors.end_date && <FieldError errors={[form.formState.errors.end_date]} />}
        </Field>

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