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
import { statusTypes } from '@/features/hrm/shifts'
import { type Shift } from '@/features/hrm/shifts'

type ShiftsViewDialogProps = {
  currentRow?: Shift
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShiftsViewDialog({
                                   currentRow,
                                   open,
                                   onOpenChange,
                                 }: ShiftsViewDialogProps) {
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
            <DialogTitle>Shift Details</DialogTitle>
            <DialogDescription>
              View shift information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <ShiftsView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Shift Details</DrawerTitle>
          <DrawerDescription>View shift information below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <ShiftsView currentRow={currentRow} />
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

interface ShiftsViewProps {
  className?: string
  currentRow: Shift
}

function ShiftsView({ className, currentRow }: ShiftsViewProps) {
  const status = currentRow.is_active ? 'active' : 'inactive'
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.name}</div>
          <div className='text-sm text-muted-foreground'>
            Total Working Hours: <span className='font-mono font-medium'>{currentRow.total_hours}h</span>
          </div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {status}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Start Time</div>
          <div className='text-sm font-semibold'>{currentRow.start_time?.substring(0, 5) || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>End Time</div>
          <div className='text-sm font-semibold'>{currentRow.end_time?.substring(0, 5) || '-'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Grace In Period</div>
          <div className='text-sm'>{currentRow.grace_in} minutes</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Grace Out Period</div>
          <div className='text-sm'>{currentRow.grace_out} minutes</div>
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