'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateHoliday,
  useUpdateHoliday
} from '@/features/hrm/holidays/api'
import { holidaySchema, type HolidayFormData } from '@/features/hrm/holidays/schemas'
import { type Holiday } from '../types'

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

type HolidaysActionDialogProps = {
  currentRow?: Holiday
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HolidaysActionDialog({
  currentRow,
  open,
  onOpenChange,
}: HolidaysActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createHoliday, isPending: isCreating } = useCreateHoliday()
  const { mutate: updateHoliday, isPending: isUpdating } = useUpdateHoliday()
  const isLoading = isCreating || isUpdating

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: isEdit
      ? {
        name: currentRow.name,
        is_active: currentRow.is_active,
      }
      : {
        name: '',
        is_active: true,
      },
  })

  const onSubmit = (values: HolidayFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateHoliday({ id: currentRow.id, data: values }, options)
    } else {
      createHoliday(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the holiday details here. ' : 'Create a new holiday here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <HolidayForm
              form={form}
              onSubmit={onSubmit}
              id='holiday-form'
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='holiday-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Holiday' : 'Add New Holiday'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the holiday details here. ' : 'Create a new holiday here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <HolidayForm
            form={form}
            onSubmit={onSubmit}
            id='holiday-form'
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='holiday-form' disabled={isLoading}>
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

interface HolidayFormProps {
  form: UseFormReturn<HolidayFormData>
  onSubmit: (data: HolidayFormData) => void
  id: string
  className?: string
}

function HolidayForm({ form, onSubmit, id, className }: HolidayFormProps) {
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
              <FieldLabel htmlFor='holiday-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='holiday-name'
                placeholder='Holiday name (e.g. Sales)'
                autoComplete='off'
                {...field}
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
                <FieldLabel htmlFor='holiday-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the holiday from the system.
                </FieldDescription>
              </div>
              <Switch
                id='holiday-active'
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