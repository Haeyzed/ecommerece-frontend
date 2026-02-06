'use client'

/**
 * TaxesActionDialog
 *
 * A dialog/drawer component for creating or editing a tax.
 * It adapts its presentation (Dialog vs Drawer) based on screen size.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Tax} [props.currentRow] - The tax to edit (undefined for create)
 * @param {boolean} props.open - Controls visibility
 * @param {function} props.onOpenChange - Callback for visibility changes
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateTax,
  useUpdateTax
} from '@/features/products/taxes/api'
import { taxSchema, type TaxFormData } from '@/features/products/taxes/schemas'
import { type Tax } from '../types'

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

type TaxActionDialogProps = {
  currentRow?: Tax
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaxesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: TaxActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createTax, isPending: isCreating } = useCreateTax()
  const { mutate: updateTax, isPending: isUpdating } = useUpdateTax()
  const isLoading = isCreating || isUpdating

  // Removed <TaxFormData> generic to fix the TS coercion error
  const form = useForm({
    resolver: zodResolver(taxSchema),
    defaultValues: isEdit
      ? {
        name: currentRow.name,
        rate: currentRow.rate,
        woocommerce_tax_id: currentRow.woocommerce_tax_id,
        is_active: currentRow.is_active,
      }
      : {
        name: '',
        rate: 0,
        woocommerce_tax_id: null,
        is_active: true,
      },
  })

  const onSubmit = (values: TaxFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateTax({ id: currentRow.id, data: values }, options)
    } else {
      createTax(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Tax' : 'Add New Tax'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the tax details here. ' : 'Create a new tax here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <TaxForm
              form={form}
              onSubmit={onSubmit}
              id='tax-form'
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='tax-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Tax' : 'Add New Tax'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the tax details here. ' : 'Create a new tax here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <TaxForm
            form={form}
            onSubmit={onSubmit}
            id='tax-form'
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='tax-form' disabled={isLoading}>
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

interface TaxFormProps {
  form: UseFormReturn<TaxFormData>
  onSubmit: (data: TaxFormData) => void
  id: string
  className?: string
}

function TaxForm({ form, onSubmit, id, className }: TaxFormProps) {
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
              <FieldLabel htmlFor='tax-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='tax-name'
                placeholder='Tax name (e.g. VAT)'
                autoComplete='off'
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='rate'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='tax-rate'>Rate (%) <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='tax-rate'
                type="number"
                step="0.01"
                min="0"
                placeholder='0.00'
                autoComplete='off'
                {...field}
              />
              <FieldDescription>
                The tax percentage rate.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='woocommerce_tax_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='tax-woo-id'>WooCommerce Tax ID</FieldLabel>
              <Input
                id='tax-woo-id'
                type="number"
                placeholder='ID from WooCommerce'
                autoComplete='off'
                {...field}
                value={field.value ?? ''}
              />
              <FieldDescription>
                Optional ID for syncing with WooCommerce.
              </FieldDescription>
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
                <FieldLabel htmlFor='tax-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the tax from calculations.
                </FieldDescription>
              </div>
              <Switch
                id='tax-active'
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