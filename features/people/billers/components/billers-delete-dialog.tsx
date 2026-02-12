'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteBiller } from '../api'
import type { Biller } from '../schemas'

type BillersDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Biller
}

export function BillersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: BillersDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteBiller, isPending } = useDeleteBiller()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteBiller(currentRow.id, {
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
          Delete Biller
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
            Biller name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter biller name to confirm"
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
