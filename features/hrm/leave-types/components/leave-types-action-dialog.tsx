'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateLeaveType,
  useUpdateLeaveType
} from '@/features/hrm/leave-types/api'
import { leaveTypeSchema, type LeaveTypeFormData } from '@/features/hrm/leave-types/schemas'
import { type LeaveType } from '../types'

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

type LeaveTypesActionDialogProps = {
  currentRow?: LeaveType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeaveTypesActionDialog({
                                         currentRow,
                                         open,
                                         onOpenChange,
                                       }: LeaveTypesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createLeaveType, isPending: isCreating } = useCreateLeaveType()
  const { mutate: updateLeaveType, isPending: isUpdating } = useUpdateLeaveType()
  const isLoading = isCreating || isUpdating

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        annual_quota: currentRow.annual_quota,
        carry_forward_limit: currentRow.carry_forward_limit,
        encashable: currentRow.encashable,
        is_active: currentRow.is_active,
      }
      : {
        name: '',
        annual_quota: 0,
        carry_forward_limit: 0,
        encashable: false,
        is_active: true,
      },
  })

  const onSubmit = (values: LeaveTypeFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateLeaveType({ id: currentRow.id, data: values }, options)
    } else {
      createLeaveType(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Leave Type' : 'Add New Leave Type'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the leave type details here. ' : 'Create a new leave type here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <LeaveTypeForm form={form} onSubmit={onSubmit} id='leave-type-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='leave-type-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
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
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Leave Type' : 'Add New Leave Type'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the leave type details here. ' : 'Create a new leave type here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <LeaveTypeForm form={form} onSubmit={onSubmit} id='leave-type-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='leave-type-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
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

interface LeaveTypeFormProps {
  form: UseFormReturn<LeaveTypeFormData>
  onSubmit: (data: LeaveTypeFormData) => void
  id: string
  className?: string
}

function LeaveTypeForm({ form, onSubmit, id, className }: LeaveTypeFormProps) {
  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='name'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='leave-type-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='leave-type-name'
                placeholder='e.g. Annual Leave, Sick Leave'
                autoComplete='off'
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='annual_quota'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='annual-quota'>Annual Quota (Days) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='annual-quota'
                  type="number"
                  min={0}
                  step="0.5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='carry_forward_limit'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='carry-forward'>Carry Forward Limit <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='carry-forward'
                  type="number"
                  min={0}
                  step="0.5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='encashable'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='leave-type-encashable'>Encashable</FieldLabel>
                <FieldDescription>
                  Can employees convert unused leave days into cash?
                </FieldDescription>
              </div>
              <Switch
                id='leave-type-encashable'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='leave-type-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the leave type from the system.
                </FieldDescription>
              </div>
              <Switch
                id='leave-type-active'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}