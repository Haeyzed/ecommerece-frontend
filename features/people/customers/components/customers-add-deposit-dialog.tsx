'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAddCustomerDeposit } from '../api'
import type { Customer } from '../types'

const addDepositSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  note: z.string().max(500).optional().nullable(),
})

type AddDepositFormData = z.infer<typeof addDepositSchema>

type CustomersAddDepositDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
}

export function CustomersAddDepositDialog({
  open,
  onOpenChange,
  customer,
}: CustomersAddDepositDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: addDeposit, isPending } = useAddCustomerDeposit(customer.id)

  const form = useForm<AddDepositFormData>({
    resolver: zodResolver(addDepositSchema),
    defaultValues: { amount: 0, note: '' },
  })

  const handleSubmit = form.handleSubmit((values) => {
    addDeposit(
      { amount: values.amount, note: values.note || null },
      {
        onSuccess: () => {
          form.reset({ amount: 0, note: '' })
          onOpenChange(false)
        },
      }
    )
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset({ amount: 0, note: '' })
    onOpenChange(value)
  }

  const content = (
    <form id="add-deposit-form" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Amount</FieldLabel>
          <Input
            type="number"
            step="0.01"
            min={0.01}
            {...form.register('amount')}
            data-invalid={!!form.formState.errors.amount}
          />
          {form.formState.errors.amount && (
            <FieldError errors={[form.formState.errors.amount]} />
          )}
        </Field>
        <Field>
          <FieldLabel>Note (optional)</FieldLabel>
          <Input
            {...form.register('note')}
            placeholder="Note"
            data-invalid={!!form.formState.errors.note}
          />
          {form.formState.errors.note && (
            <FieldError errors={[form.formState.errors.note]} />
          )}
        </Field>
      </FieldGroup>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="text-start">
            <DialogTitle>Add Deposit</DialogTitle>
            <DialogDescription>
              Add a deposit for {customer.name}. This will increase the
              customer&apos;s deposited balance.
            </DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter className="gap-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-deposit-form"
              disabled={isPending}
            >
              {isPending ? 'Adding…' : 'Add Deposit'}
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
            Add a deposit for {customer.name}.
          </DrawerDescription>
        </DrawerHeader>
        {content}
        <DrawerFooter className="gap-y-2">
          <Button
            type="submit"
            form="add-deposit-form"
            disabled={isPending}
          >
            {isPending ? 'Adding…' : 'Add Deposit'}
          </Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
