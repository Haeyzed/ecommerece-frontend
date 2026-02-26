'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateDesignation,
  useUpdateDesignation
} from '@/features/hrm/designations'
import { designationSchema, type DesignationFormData } from '@/features/hrm/designations'
import { type Designation } from '@/features/hrm/designations'

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

type DesignationsActionDialogProps = {
  currentRow?: Designation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DesignationsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DesignationsActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createDesignation, isPending: isCreating } = useCreateDesignation()
  const { mutate: updateDesignation, isPending: isUpdating } = useUpdateDesignation()
  const isLoading = isCreating || isUpdating

  const form = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
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

  const onSubmit = (values: DesignationFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateDesignation({ id: currentRow.id, data: values }, options)
    } else {
      createDesignation(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Designation' : 'Add New Designation'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the designation details here. ' : 'Create a new designation here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <DesignationForm
              form={form}
              onSubmit={onSubmit}
              id='designation-form'
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='designation-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Designation' : 'Add New Designation'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the designation details here. ' : 'Create a new designation here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <DesignationForm
            form={form}
            onSubmit={onSubmit}
            id='designation-form'
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='designation-form' disabled={isLoading}>
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

interface DesignationFormProps {
  form: UseFormReturn<DesignationFormData>
  onSubmit: (data: DesignationFormData) => void
  id: string
  className?: string
}

function DesignationForm({ form, onSubmit, id, className }: DesignationFormProps) {
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
              <FieldLabel htmlFor='designation-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='designation-name'
                placeholder='e.g. Software Engineer'
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
                <FieldLabel htmlFor='designation-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the designation from the system.
                </FieldDescription>
              </div>
              <Switch
                id='designation-active'
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