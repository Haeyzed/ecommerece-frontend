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
import { statusTypes } from '@/features/hrm/holidays/constants'
import { type Holiday } from '@/features/hrm/holidays/types'
import { format } from 'date-fns'

type HolidaysViewDialogProps = {
  currentRow?: Holiday
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HolidaysViewDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: HolidaysViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  const ViewContent = () => {
    // Determine the active status for the badge
    const status = currentRow.approve_status || (currentRow.is_approved ? 'approved' : 'unapproved')
    const statusBadgeColor = statusTypes.get(status as any)

    return (
      <div className={cn('space-y-6')}>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <div className='text-xl font-semibold'>
              {currentRow.note || 'Unnamed Holiday'}
            </div>
            <div className='text-sm text-muted-foreground'>
              {currentRow.region ? `Region: ${currentRow.region}` : 'Global Holiday'}
            </div>
          </div>
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
            {status}
          </Badge>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>From Date</div>
            <div className='text-sm font-medium'>
              {currentRow.from_date ? format(new Date(currentRow.from_date), 'MMMM dd, yyyy') : 'N/A'}
            </div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>To Date</div>
            <div className='text-sm font-medium'>
              {currentRow.to_date ? format(new Date(currentRow.to_date), 'MMMM dd, yyyy') : 'N/A'}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Recurring Annually</div>
            <div className='text-sm font-medium'>{currentRow.recurring ? 'Yes' : 'No'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Added By User ID</div>
            <div className='text-sm font-medium'>{currentRow.user_id || 'System'}</div>
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='text-start'>
            <DialogTitle>Holiday Details</DialogTitle>
            <DialogDescription>
              View information about this holiday below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <ViewContent />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Holiday Details</DrawerTitle>
          <DrawerDescription>View information about this holiday below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <ViewContent />
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