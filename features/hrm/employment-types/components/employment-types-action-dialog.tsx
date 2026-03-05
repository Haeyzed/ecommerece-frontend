'use client'

import { Controller, type UseFormReturn, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'

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
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'

import {
  useCreateEmploymentType,
  useUpdateEmploymentType,
} from '@/features/hrm/employment-types/api'
import {
  type EmploymentTypeFormData,
  employmentTypeSchema,
} from '@/features/hrm/employment-types/schemas'

import { type EmploymentType } from '../types'

type EmploymentTypesActionDialogProps = {
  currentRow?: EmploymentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmploymentTypesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: EmploymentTypesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createEmploymentType, isPending: isCreating } =
    useCreateEmploymentType()
  const { mutate: updateEmploymentType, isPending: isUpdating } =
    useUpdateEmploymentType()
  const isLoading = isCreating || isUpdating

  const form = useForm<EmploymentTypeFormData>({
    resolver: zodResolver(employmentTypeSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            is_active: currentRow.is_active,
          }
        : {
            name: '',
            is_active: true,
          },
  })

  const onSubmit = (values: EmploymentTypeFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateEmploymentType({ id: currentRow.id, data: values }, options)
    } else {
      createEmploymentType(values, options)
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
            <DialogTitle>
              {isEdit ? 'Edit Employment Type' : 'Add New Employment Type'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the employment type details here. '
                : 'Create a new employment type here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <EmploymentTypeForm
              form={form}
              onSubmit={onSubmit}
              id='employment-type-form'
            />
          </div>

          <DialogFooter>
            <Button
              type='submit'
              form='employment-type-form'
              disabled={isLoading}
            >
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
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>
            {isEdit ? 'Edit Employment Type' : 'Add New Employment Type'}
          </DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? 'Update the employment type details here. '
              : 'Create a new employment type here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <EmploymentTypeForm
            form={form}
            onSubmit={onSubmit}
            id='employment-type-form'
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='employment-type-form' disabled={isLoading}>
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

interface EmploymentTypeFormProps {
  form: UseFormReturn<EmploymentTypeFormData>
  onSubmit: (data: EmploymentTypeFormData) => void
  id: string
  className?: string
}

function EmploymentTypeForm({
  form,
  onSubmit,
  id,
  className,
}: EmploymentTypeFormProps) {
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
              <FieldLabel htmlFor='employment-type-name'>
                Name <span className='text-destructive'>*</span>
              </FieldLabel>
              <Input
                id='employment-type-name'
                placeholder='e.g. Fulltime'
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
                <FieldLabel htmlFor='employment-type-active'>
                  Active Status
                </FieldLabel>
                <FieldDescription>
                  Disabling this will hide the employment type from the system.
                </FieldDescription>
              </div>
              <Switch
                id='employment-type-active'
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
