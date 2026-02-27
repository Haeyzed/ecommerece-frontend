'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteAttendance } from '@/features/hrm/attendances/api'
import { type Attendance } from '../types'
import { useAuthSession } from '@/features/auth/api'

type AttendancesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Attendance
}

const CONFIRM_WORD = 'DELETE'

export function AttendancesDeleteDialog({
                                          open,
                                          onOpenChange,
                                          currentRow,
                                        }: AttendancesDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteAttendance, isPending } = useDeleteAttendance()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete attendances')

  if (!canDelete) return null

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return

    deleteAttendance(currentRow.id, {
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
          Delete Attendance Record
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the attendance record for{' '}
            <span className='font-bold'>{currentRow.employee?.name || `Emp #${currentRow.employee_id}`}</span> on{' '}
            <span className='font-bold'>{currentRow.date}</span>?
            <br />
            This action will permanently remove the record from the system.
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