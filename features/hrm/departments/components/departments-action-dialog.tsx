'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateDepartment,
  useUpdateDepartment
} from '@/features/hrm/departments/api'
import { departmentSchema, type DepartmentFormData } from '@/features/hrm/departments/schemas'
import { type Department } from '../types'

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

type DepartmentsActionDialogProps = {
  currentRow?: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DepartmentsActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment()
  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment()
  const isLoading = isCreating || isUpdating

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
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

  const onSubmit = (values: DepartmentFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateDepartment({ id: currentRow.id, data: values }, options)
    } else {
      createDepartment(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Department' : 'Add New Department'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the department details here. ' : 'Create a new department here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <DepartmentForm
              form={form}
              onSubmit={onSubmit}
              id='department-form'
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='department-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Department' : 'Add New Department'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the department details here. ' : 'Create a new department here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <DepartmentForm
            form={form}
            onSubmit={onSubmit}
            id='department-form'
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='department-form' disabled={isLoading}>
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

interface DepartmentFormProps {
  form: UseFormReturn<DepartmentFormData>
  onSubmit: (data: DepartmentFormData) => void
  id: string
  className?: string
}

function DepartmentForm({ form, onSubmit, id, className }: DepartmentFormProps) {
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
              <FieldLabel htmlFor='department-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='department-name'
                placeholder='Department name (e.g. Sales)'
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
                <FieldLabel htmlFor='department-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the department from the system.
                </FieldDescription>
              </div>
              <Switch
                id='department-active'
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