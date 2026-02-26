'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateRole,
  useUpdateRole,
} from '@/features/settings/acl/roles/api'
import { useOptionPermissions } from '@/features/settings/acl/permissions/api'
import { roleSchema, type RoleFormData } from '@/features/settings/acl/roles/schemas'
import { type Role, RoleOption } from '../types'

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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

type RolesActionDialogProps = {
  currentRow?: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolesActionDialog({
                                    currentRow,
                                    open,
                                    onOpenChange,
                                  }: RolesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createRole, isPending: isCreating } = useCreateRole()
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole()
  const isLoading = isCreating || isUpdating

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        description: currentRow.description || '',
        guard_name: currentRow.guard_name || 'web',
        is_active: currentRow.is_active,
        permissions: currentRow.permissions?.map((p) => p.id) || [],
      }
      : {
        name: '',
        description: '',
        guard_name: 'web',
        is_active: true,
        permissions: [],
      },
  })

  const onSubmit = (values: RoleFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateRole({ id: currentRow.id, data: values }, options)
    } else {
      createRole(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the role details here. ' : 'Create a new role here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <RoleForm form={form} onSubmit={onSubmit} id='role-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='role-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the role details here. ' : 'Create a new role here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <RoleForm form={form} onSubmit={onSubmit} id='role-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='role-form' disabled={isLoading}>
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

interface RoleFormProps {
  form: UseFormReturn<RoleFormData>
  onSubmit: (data: RoleFormData) => void
  id: string
  className?: string
}

function RoleForm({ form, onSubmit, id, className }: RoleFormProps) {
  const { data: permissionsOptions = [] } = useOptionPermissions()
  const anchor = useComboboxAnchor()

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
              <FieldLabel htmlFor='role-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='role-name'
                placeholder='e.g. HR Manager'
                autoComplete='off'
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="permissions"
          render={({ field, fieldState }) => {
            // Map the field array of IDs to full option objects for Combobox
            const selectedItems = field.value
              ? field.value
                .map((id) => permissionsOptions.find((opt) => opt.value === id))
                .filter((opt): opt is { value: number; label: string } => !!opt)
              : []

            return (
              <Field data-invalid={!!fieldState.error} className="flex flex-col">
                <FieldLabel htmlFor="role-permissions">Permissions</FieldLabel>
                <Combobox
                  multiple
                  autoHighlight
                  items={permissionsOptions}
                  itemToStringLabel={(item) => item.label}
                  value={selectedItems}
                  onValueChange={(items) => {
                    field.onChange(items.map((item) => item.value))
                  }}
                  isItemEqualToValue={(a, b) => a?.value === b?.value}
                >
                  <ComboboxChips ref={anchor} id="role-permissions">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((item: RoleOption) => (
                            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Select permissions..." />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No permissions found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>Select the permissions to assign to this role.</FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
          name='description'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='role-description'>Description</FieldLabel>
              <Textarea
                id='role-description'
                placeholder='Role description...'
                autoComplete='off'
                className='resize-none'
                {...field}
                value={field.value || ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='guard_name'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='role-guard'>Guard Name</FieldLabel>
              <Input
                id='role-guard'
                placeholder='e.g. web'
                autoComplete='off'
                {...field}
                value={field.value || 'web'}
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
                <FieldLabel htmlFor='role-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the role from the system.
                </FieldDescription>
              </div>
              <Switch
                id='role-active'
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