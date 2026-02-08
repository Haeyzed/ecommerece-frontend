"use client"

import { AlertTriangle } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteWarehouse } from '../api'
import { type Warehouse } from '../types'

type WarehousesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse | null
}

export function WarehousesDeleteDialog({
  open,
  onOpenChange,
  warehouse: currentRow,
}: WarehousesDeleteDialogProps) {
  const { mutate: deleteWarehouse, isPending } = useDeleteWarehouse()

  const handleDelete = () => {
    if (!currentRow) return

    deleteWarehouse(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  if (!currentRow) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <HugeiconsIcon
              icon={AlertTriangle}
              className='size-5 text-destructive'
            />
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to deactivate the warehouse &quot;{currentRow.name}&quot;. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
