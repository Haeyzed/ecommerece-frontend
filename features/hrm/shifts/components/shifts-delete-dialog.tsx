'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteShift } from '@/features/hrm/shifts'
import { type Shift } from '../types'
import { useAuthSession } from '@/features/auth/api'

type ShiftsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Shift
}

export function ShiftsDeleteDialog({
                                     open,
                                     onOpenChange,
                                     currentRow,
                                   }: ShiftsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteShift, isPending } = useDeleteShift()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete shifts')

  if (!canDelete) return null

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteShift(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      }
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isPending}
      title={
        <span className='text-destructive'>
          <HugeiconsIcon
            icon={Alert02Icon}
            className='me-1 inline-block stroke-destructive'
            size={18}
            strokeWidth={2}
          />{' '}
          Delete Shift
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the shift from the system.
            This cannot be undone.
          </p>

          <Label className='my-2'>
            Shift Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter shift name to confirm deletion.'
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