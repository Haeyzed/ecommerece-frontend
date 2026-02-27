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
import { attendanceStatusStyles } from '@/features/hrm/attendances/constants'
import { type Attendance } from '@/features/hrm/attendances/types'

type AttendancesViewDialogProps = {
  currentRow?: Attendance
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttendancesViewDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: AttendancesViewDialogProps) {
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
            <DialogTitle>Attendance Record Details</DialogTitle>
            <DialogDescription>
              View detailed information about this attendance record below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <AttendancesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Attendance Record Details</DrawerTitle>
          <DrawerDescription>View detailed information about this attendance record below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <AttendancesView currentRow={currentRow} />
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

interface AttendancesViewProps {
  className?: string
  currentRow: Attendance
}

function AttendancesView({ className, currentRow }: AttendancesViewProps) {
  const statusBadgeColor = attendanceStatusStyles.get(currentRow.status) || 'bg-neutral-100'

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.employee?.name || `Emp #${currentRow.employee_id}`}</div>
          <div className='text-sm text-muted-foreground'>
            Date: <span className='font-medium font-mono'>{currentRow.date}</span>
          </div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {currentRow.status}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Check In</div>
          <div className='text-sm font-medium font-mono'>{currentRow.checkin || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Check Out</div>
          <div className='text-sm font-medium font-mono'>{currentRow.checkout || '-'}</div>
        </div>
        <div className='space-y-2 col-span-2'>
          <div className='text-sm font-medium text-muted-foreground'>Note / Reason</div>
          <div className='text-sm font-medium'>{currentRow.note || '-'}</div>
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