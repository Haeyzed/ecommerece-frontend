'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import { statusTypes } from '../constants'
import { type Warehouse } from '../types'

type WarehousesViewDialogProps = {
  currentRow?: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehousesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: WarehousesViewDialogProps) {
  if (!currentRow) return null

  const status = currentRow.is_active ? 'active' : 'inactive'
  const StatusIcon = currentRow.is_active ? CheckmarkCircle02Icon : MultiplicationSignIcon
  const statusBadgeColor = statusTypes.get(status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Warehouse Details</DialogTitle>
          <DialogDescription>
            View warehouse information below.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
          <div className='space-y-6 px-0.5'>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>Name</div>
              <div className='text-sm font-medium'>{currentRow.name}</div>
            </div>

            {currentRow.phone && (
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Phone</div>
                <div className='text-sm'>{currentRow.phone}</div>
              </div>
            )}

            {currentRow.email && (
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Email</div>
                <div className='text-sm'>{currentRow.email}</div>
              </div>
            )}

            {currentRow.address && (
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Address</div>
                <div className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {currentRow.address}
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>Status</div>
              <Badge
                variant='outline'
                className={`flex w-fit items-center gap-1.5 ${statusBadgeColor || ''}`}
              >
                <HugeiconsIcon icon={StatusIcon} className='size-3' />
                {status}
              </Badge>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>Created At</div>
              <div className='text-sm text-muted-foreground'>
                {currentRow.created_at
                  ? new Date(currentRow.created_at).toLocaleString()
                  : 'N/A'}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm font-medium text-muted-foreground'>Updated At</div>
              <div className='text-sm text-muted-foreground'>
                {currentRow.updated_at
                  ? new Date(currentRow.updated_at).toLocaleString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
