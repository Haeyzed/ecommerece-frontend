'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteSupplier } from '../api'
import type { Supplier } from '../schemas'

type SuppliersDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Supplier
}

export function SuppliersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: SuppliersDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteSupplier, isPending } = useDeleteSupplier()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteSupplier(currentRow.id, {
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
          Delete Supplier
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
            Supplier name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter supplier name to confirm"
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
