'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteCustomer } from '../api'
import type { Customer } from '../types'

type CustomersDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Customer
}

export function CustomersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomersDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteCustomer(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isPending}
      title={
        <span className="text-destructive">
          <HugeiconsIcon
            icon={Alert02Icon}
            className="me-1 inline-block stroke-destructive"
            size={18}
            strokeWidth={2}
          />{' '}
          Delete Customer
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow.name}</span>? This action
            cannot be undone.
          </p>
          <Label className="my-2">
            Customer name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter customer name to confirm"
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  )
}
