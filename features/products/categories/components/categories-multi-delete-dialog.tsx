'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useBulkDestroyCategories } from '../api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Category } from '../types'
import { useAuthSession } from '@/features/auth/api'

type CategoriesMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function CategoriesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CategoriesMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map(row => (row.original as Category).id)
  
  const { mutate: bulkDestroy, isPending } = useBulkDestroyCategories()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete categories')
  if (!canDelete) return null

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
      }
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isPending}
      title={
        <span className='text-destructive'>
          <HugeiconsIcon
            icon={Alert02Icon}
            className='me-1 inline-block stroke-destructive'
            size={18}
            strokeWidth={2}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'categories' : 'category'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected categories? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}