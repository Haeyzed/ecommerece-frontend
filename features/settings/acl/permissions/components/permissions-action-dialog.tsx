'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreatePermission,
  useUpdatePermission
} from '@/features/settings/acl/permissions/api'
import { permissionSchema, type PermissionFormData } from '@/features/settings/acl/permissions/schemas'
import { type Permission } from '../types'

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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

type PermissionsActionDialogProps = {
  currentRow?: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionsActionDialog({
                                          currentRow,
                                          open,
                                          onOpenChange,
                                        }: PermissionsActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createPermission, isPending: isCreating } = useCreatePermission()
  const { mutate: updatePermission, isPending: isUpdating } = useUpdatePermission()
  const isLoading = isCreating || isUpdating

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        guard_name: currentRow.guard_name || 'web',
        module: currentRow.module || '',
        description: currentRow.description || '',
        is_active: currentRow.is_active,
      }
      : {
        name: '',
        guard_name: 'web',
        module: '',
        description: '',
        is_active: true,
      },
  })

  const onSubmit = (values: PermissionFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updatePermission({ id: currentRow.id, data: values }, options)
    } else {
      createPermission(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Permission' : 'Add New Permission'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the permission details here. ' : 'Create a new permission here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <PermissionForm form={form} onSubmit={onSubmit} id='permission-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='permission-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Permission' : 'Add New Permission'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the permission details here. ' : 'Create a new permission here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <PermissionForm form={form} onSubmit={onSubmit} id='permission-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='permission-form' disabled={isLoading}>
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

interface PermissionFormProps {
  form: UseFormReturn<PermissionFormData>
  onSubmit: (data: PermissionFormData) => void
  id: string
  className?: string
}

function PermissionForm({ form, onSubmit, id, className }: PermissionFormProps) {
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
              <FieldLabel htmlFor='permission-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='permission-name'
                placeholder='e.g. view employees'
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
            name='guard_name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='permission-guard'>Guard Name</FieldLabel>
                <Input
                  id='permission-guard'
                  placeholder='e.g. web'
                  autoComplete='off'
                  {...field}
                  value={field.value || ''}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='module'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='permission-module'>Module</FieldLabel>
                <Input
                  id='permission-module'
                  placeholder='e.g. hrm'
                  autoComplete='off'
                  {...field}
                  value={field.value || ''}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='description'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='permission-description'>Description</FieldLabel>
              <Textarea
                id='permission-description'
                placeholder='Describe the permission...'
                className='resize-none'
                autoComplete='off'
                {...field}
                value={field.value || ''}
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
                <FieldLabel htmlFor='permission-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the permission from the system.
                </FieldDescription>
              </div>
              <Switch
                id='permission-active'
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