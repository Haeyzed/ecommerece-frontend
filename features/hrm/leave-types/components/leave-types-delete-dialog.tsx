'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteLeaveType } from '@/features/hrm/leave-types/api'
import { type LeaveType } from '../types'
import { useAuthSession } from '@/features/auth/api'

type LeaveTypesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: LeaveType
}

export function LeaveTypesDeleteDialog({
                                         open,
                                         onOpenChange,
                                         currentRow,
                                       }: LeaveTypesDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteLeaveType, isPending } = useDeleteLeaveType()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete leave types')
  if (!canDelete) return null

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteLeaveType(currentRow.id, {
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
          Delete Leave Type
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the leave type from the system.
            This cannot be undone.
          </p>

          <Label className='my-2'>
            Leave Type Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter leave type name to confirm deletion.'
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