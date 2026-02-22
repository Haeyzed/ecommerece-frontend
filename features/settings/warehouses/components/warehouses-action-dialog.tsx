'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from '@/features/settings/warehouses/api'
import { warehouseSchema, type WarehouseFormData } from '@/features/settings/warehouses/schemas'
import { type Warehouse } from '../types'

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
  Field, FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { PhoneInput } from "@/components/ui/phone-input";

type WarehousesActionDialogProps = {
  currentRow?: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehousesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: WarehousesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createWarehouse, isPending: isCreating } = useCreateWarehouse()
  const { mutate: updateWarehouse, isPending: isUpdating } = useUpdateWarehouse()
  const isLoading = isCreating || isUpdating

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: isEdit && currentRow
      ? {
          name: currentRow.name,
          phone: currentRow.phone ?? '',
          email: currentRow.email ?? '',
          address: currentRow.address ?? '',
          is_active: currentRow.is_active,
        }
      : {
          name: '',
          phone: '',
          email: '',
          address: '',
          is_active: true,
        },
  })

  const onSubmit = (values: WarehouseFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateWarehouse({ id: currentRow.id, data: values }, options)
    } else {
      createWarehouse(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the warehouse details here. ' : 'Create a new warehouse here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <WarehouseForm form={form} onSubmit={onSubmit} id='warehouse-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='warehouse-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Warehouse' : 'Add New Warehouse'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the warehouse details here. ' : 'Create a new warehouse here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <WarehouseForm form={form} onSubmit={onSubmit} id='warehouse-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='warehouse-form' disabled={isLoading}>
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

interface WarehouseFormProps {
  form: UseFormReturn<WarehouseFormData>
  onSubmit: (data: WarehouseFormData) => void
  id: string
  className?: string
}

function WarehouseForm({ form, onSubmit, id, className }: WarehouseFormProps) {
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
              <FieldLabel htmlFor='warehouse-name'>Name <span className='text-destructive'>*</span></FieldLabel>
              <Input id='warehouse-name' placeholder='Warehouse name' autoComplete='off' {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='phone'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='warehouse-phone'>Phone</FieldLabel>
              <PhoneInput id='warehouse-phone' placeholder='+1234567890' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='warehouse-email'>Email</FieldLabel>
              <Input id='warehouse-email' type='email' placeholder='warehouse@example.com' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='address'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='warehouse-address'>Address</FieldLabel>
              <Textarea id='warehouse-address' placeholder='123 Main St' rows={3} className='resize-none' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='warehouse-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the warehouse from the system.
                </FieldDescription>
              </div>
              <Switch id='warehouse-active' checked={!!field.value} onCheckedChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
