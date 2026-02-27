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
import { overtimeStatusStyles } from '@/features/hrm/overtimes/constants'
import { type Overtime } from '@/features/hrm/overtimes/types'

type OvertimesViewDialogProps = {
  currentRow?: Overtime
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OvertimesViewDialog({
                                      currentRow,
                                      open,
                                      onOpenChange,
                                    }: OvertimesViewDialogProps) {
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
            <DialogTitle>Overtime Record Details</DialogTitle>
            <DialogDescription>
              View detailed information about this overtime record below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <OvertimesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Overtime Record Details</DrawerTitle>
          <DrawerDescription>View detailed information about this overtime record below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <OvertimesView currentRow={currentRow} />
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

interface OvertimesViewProps {
  className?: string
  currentRow: Overtime
}

function OvertimesView({ className, currentRow }: OvertimesViewProps) {
  const statusBadgeColor = overtimeStatusStyles.get(currentRow.status) || 'bg-neutral-100'

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.employee?.name || `Emp #${currentRow.employee_id}`}</div>
          <div className='text-sm text-muted-foreground'>
            Date: <span className='font-mono font-medium'>{currentRow.date}</span>
          </div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {currentRow.status}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Hours</div>
          <div className='text-sm font-medium font-mono'>{currentRow.hours} h</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Rate</div>
          <div className='text-sm font-medium font-mono'>${Number(currentRow.rate).toFixed(2)}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Total Amount</div>
          <div className='text-sm font-medium font-mono'>${Number(currentRow.amount).toFixed(2)}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Approver</div>
          <div className='text-sm font-medium'>{currentRow.approver?.name || '-'}</div>
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