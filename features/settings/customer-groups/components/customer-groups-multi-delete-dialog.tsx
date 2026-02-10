'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import type { Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useBulkDestroyCustomerGroups } from '../api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { CustomerGroup } from '../types'

const CONFIRM_WORD = 'DELETE'

type CustomerGroupsMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function CustomerGroupsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CustomerGroupsMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as CustomerGroup).id)
  const { mutate: bulkDestroy, isPending } = useBulkDestroyCustomerGroups()

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
          <HugeiconsIcon icon={Alert02Icon} className="me-1 inline-block stroke-destructive" size={18} strokeWidth={2} />
          Delete {selectedRows.length} customer group{selectedRows.length === 1 ? '' : 's'}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">Are you sure you want to delete the selected customer groups? This cannot be undone.</p>
          <Label className="my-4 flex flex-col gap-1.5">
            <span>Type &quot;{CONFIRM_WORD}&quot; to confirm:</span>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Type "${CONFIRM_WORD}"`} />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>This operation cannot be rolled back.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  )
}
