"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { leaveStatusStyles } from '@/features/hrm/leaves/constants'
import { type Leave } from '@/features/hrm/leaves/types'

type LeavesViewDialogProps = {
  currentRow?: Leave
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeavesViewDialog({
                                   currentRow,
                                   open,
                                   onOpenChange,
                                 }: LeavesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='text-start'>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View detailed information about this leave request below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <LeavesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Leave Request Details</DrawerTitle>
          <DrawerDescription>View detailed information about this leave request below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <LeavesView currentRow={currentRow} />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface LeavesViewProps {
  className?: string
  currentRow: Leave
}

function LeavesView({ className, currentRow }: LeavesViewProps) {
  const statusBadgeColor = leaveStatusStyles.get(currentRow.status) || 'bg-neutral-100'

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.employee?.name || `Emp #${currentRow.employee_id}`}</div>
          <div className='text-sm text-muted-foreground'>
            Leave Type: <span className='font-medium'>{currentRow.leave_type?.name || `Type #${currentRow.leave_type_id}`}</span>
          </div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {currentRow.status}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Start Date</div>
          <div className='text-sm font-medium font-mono'>{currentRow.start_date}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>End Date</div>
          <div className='text-sm font-medium font-mono'>{currentRow.end_date}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Total Days</div>
          <div className='text-sm font-medium'>{currentRow.days} days</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Approver</div>
          <div className='text-sm font-medium'>{currentRow.approver_name || '-'}</div>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
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
  )
}