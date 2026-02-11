'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import { useAddCustomerDeposit } from '../api'
import { addDepositSchema, type AddDepositFormData } from '../schemas'
import type { Customer } from '../types'

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'

type CustomersAddDepositDialogProps = {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersAddDepositDialog({
  customer,
  open,
  onOpenChange,
}: CustomersAddDepositDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: addDeposit, isPending } = useAddCustomerDeposit(customer.id)

  const form = useForm<AddDepositFormData>({
    resolver: zodResolver(addDepositSchema),
    defaultValues: { amount: 0, note: '' },
  })

  const onSubmit = (values: AddDepositFormData) => {
    addDeposit(
      { amount: values.amount, note: values.note || null },
      {
        onSuccess: () => {
          form.reset({ amount: 0, note: '' })
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset({ amount: 0, note: '' })
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Add Deposit</DialogTitle>
            <DialogDescription>
              Add a deposit for {customer.name}. This will increase the
              customer&apos;s deposited balance. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-3">
            <AddDepositForm form={form} onSubmit={onSubmit} id="add-deposit-form" />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              form="add-deposit-form"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Adding…
                </>
              ) : (
                'Add Deposit'
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
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Deposit</DrawerTitle>
          <DrawerDescription>
            Add a deposit for {customer.name}. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">
          <AddDepositForm form={form} onSubmit={onSubmit} id="add-deposit-form" />
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            form="add-deposit-form"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                Adding…
              </>
            ) : (
              'Add Deposit'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface AddDepositFormProps {
  form: UseFormReturn<AddDepositFormData>
  onSubmit: (data: AddDepositFormData) => void
  id: string
  className?: string
}

function AddDepositForm({ form, onSubmit, id, className }: AddDepositFormProps) {
  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="deposit-amount">
                Amount <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                min={0.01}
                placeholder="0.00"
                autoComplete="off"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="note"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="deposit-note">Note (optional)</FieldLabel>
              <Textarea
                id="deposit-note"
                placeholder="Note"
                autoComplete="off"
                {...field}
                value={field.value ?? ''}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
