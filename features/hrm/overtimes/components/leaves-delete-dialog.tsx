'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteLeave } from '@/features/hrm/leaves/api'
import { type Leave } from '../types'
import { useAuthSession } from '@/features/auth/api'

type LeavesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Leave
}

const CONFIRM_WORD = 'DELETE'

export function LeavesDeleteDialog({
                                     open,
                                     onOpenChange,
                                     currentRow,
                                   }: LeavesDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteLeave, isPending } = useDeleteLeave()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete leaves')

  if (!canDelete) return null

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return

    deleteLeave(currentRow.id, {
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
      disabled={value.trim() !== CONFIRM_WORD || isPending}
      title={
        <span className='text-destructive'>
          <HugeiconsIcon
            icon={Alert02Icon}
            className='me-1 inline-block stroke-destructive'
            size={18}
            strokeWidth={2}
          />{' '}
          Delete Leave Request
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the leave request for{' '}
            <span className='font-bold'>{currentRow.employee?.name || `Emp #${currentRow.employee_id}`}</span>?
            <br />
            This action will permanently remove the leave request from the system.
            This cannot be undone.
          </p>

          <Label className='my-2 flex flex-col items-start gap-1.5'>
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