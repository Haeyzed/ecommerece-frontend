'use client'

/**
 * CustomerGroupsDeleteDialog
 *
 * A confirmation dialog for deleting a single customer group.
 * Requires the user to type the customer group name to confirm the destructive action.
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Controls visibility
 * @param {function} props.onOpenChange - Callback for visibility changes
 * @param {CustomerGroup} props.currentRow - The customer group selected for deletion
 */

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteCustomerGroup } from '../api'
import type { CustomerGroup } from '../types'

type CustomerGroupsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: CustomerGroup
}

export function CustomerGroupsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomerGroupsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: deleteGroup, isPending } = useDeleteCustomerGroup()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteGroup(currentRow.id, {
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
        <span className='text-destructive'>
          <HugeiconsIcon
            icon={Alert02Icon}
            className='me-1 inline-block stroke-destructive'
            size={18}
            strokeWidth={2}
          />{' '}
          Delete Customer Group
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the customer group from the system.
            This cannot be undone.
          </p>

          <Label className='my-2'>
            Customer Group Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter customer group name to confirm deletion.'
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
