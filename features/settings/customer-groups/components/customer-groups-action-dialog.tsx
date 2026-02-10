'use client'

import type { Resolver } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCreateCustomerGroup, useUpdateCustomerGroup } from '../api'
import { customerGroupSchema, type CustomerGroupFormData } from '../schemas'
import type { CustomerGroup } from '../types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

type CustomerGroupsActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CustomerGroup
}

export function CustomerGroupsActionDialog(props: CustomerGroupsActionDialogProps) {
  const { open, onOpenChange, currentRow } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: create, isPending: isCreating } = useCreateCustomerGroup()
  const { mutate: update, isPending: isUpdating } = useUpdateCustomerGroup()
  const isLoading = isCreating || isUpdating
  const defaultPercentage = currentRow && typeof currentRow.percentage === 'number'
    ? currentRow.percentage
    : currentRow ? parseFloat(String(currentRow.percentage)) || 0 : 0
  const form = useForm<CustomerGroupFormData>({
    resolver: zodResolver(customerGroupSchema) as Resolver<CustomerGroupFormData>,
    defaultValues: isEdit && currentRow
      ? { name: currentRow.name, percentage: defaultPercentage, is_active: currentRow.is_active }
      : { name: '', percentage: 0, is_active: true },
  })
  const onSubmit = (values: CustomerGroupFormData) => {
    const opts = { onSuccess: () => { form.reset(); onOpenChange(false) } }
    if (isEdit && currentRow) update({ id: currentRow.id, data: values }, opts)
    else create(values, opts)
  }
  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }
  const formContent = (
    <form id="cg-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller control={form.control} name="name" render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>Name *</FieldLabel>
            <Input {...field} placeholder="Customer group name" />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )} />
        <Controller control={form.control} name="percentage" render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>Percentage (%)</FieldLabel>
            <Input type="number" min={0} max={100} step={0.01} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )} />
        <Controller control={form.control} name="is_active" render={({ field }) => (
          <Field>
            <div className="flex items-center justify-between"><FieldLabel>Active</FieldLabel><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></div>
          </Field>
        )} />
      </FieldGroup>
    </form>
  )
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>{isEdit ? 'Edit Customer Group' : 'Add Customer Group'}</DialogTitle>
            <DialogDescription>{isEdit ? 'Update details.' : 'Create a new customer group.'}</DialogDescription>
          </DialogHeader>
          <div className="py-1">{formContent}</div>
          <DialogFooter>
            <Button type="submit" form="cg-form" disabled={isLoading}>
              {isLoading ? <><Spinner className="mr-2 size-4" />Saving...</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{isEdit ? 'Edit Customer Group' : 'Add Customer Group'}</DrawerTitle>
          <DrawerDescription>{isEdit ? 'Update details.' : 'Create a new customer group.'}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
        <DrawerFooter>
          <Button type="submit" form="cg-form" disabled={isLoading}>
            {isLoading ? <><Spinner className="mr-2 size-4" />Saving...</> : 'Save'}
          </Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
