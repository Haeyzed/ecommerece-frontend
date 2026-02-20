'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteHoliday } from '../api'
import { type Holiday } from '../types'
import { useAuthSession } from '@/features/auth/api' 

type HolidaysDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Holiday
}

export function HolidaysDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: HolidaysDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteHoliday, isPending } = useDeleteHoliday()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canDelete = userPermissions.includes('delete holidays')
  if (!canDelete) return null

  const CONFIRM_WORD = 'DELETE'

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) return

    deleteHoliday(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      }
    })
  }

  const periodLabel =
    currentRow.from_date && currentRow.to_date
      ? `${currentRow.from_date} to ${currentRow.to_date}`
      : 'this leave request'

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
          Delete Holiday
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the leave request{' '}
            <span className='font-bold'>{periodLabel}</span>?
            <br />
            This action will permanently remove the holiday from the system. This
            cannot be undone.
          </p>

          <Label className='my-2'>
            Type &quot;{CONFIRM_WORD}&quot; to confirm:
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