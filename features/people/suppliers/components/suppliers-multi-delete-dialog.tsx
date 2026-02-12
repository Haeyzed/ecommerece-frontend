'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import type { Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useBulkDestroySuppliers } from '../api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Supplier } from '../schemas'

type SuppliersMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function SuppliersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: SuppliersMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Supplier).id)
  const { mutate: bulkDestroy, isPending } = useBulkDestroySuppliers()

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }
    bulkDestroy(selectedIds, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
        table.resetRowSelection()
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isPending}
      title={
        <span className="text-destructive">
          <HugeiconsIcon
            icon={Alert02Icon}
            className="me-1 inline-block stroke-destructive"
            size={18}
            strokeWidth={2}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length === 1 ? 'supplier' : 'suppliers'}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the selected suppliers? This action
            cannot be undone.
          </p>
          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
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
