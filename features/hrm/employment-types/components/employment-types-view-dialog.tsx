'use client'

import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'

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

import { statusTypes } from '@/features/hrm/employment-types/constants'
import { type EmploymentType } from '@/features/hrm/employment-types/types'

type EmploymentTypesViewDialogProps = {
  currentRow?: EmploymentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmploymentTypesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: EmploymentTypesViewDialogProps) {
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
            <DialogTitle>Employment Type Details</DialogTitle>
            <DialogDescription>
              View detailed information about this employment type below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <EmploymentTypesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Employment Type Details</DrawerTitle>
          <DrawerDescription>
            View detailed information about this employment type below.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <EmploymentTypesView currentRow={currentRow} />
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

interface EmploymentTypesViewProps {
  className?: string
  currentRow: EmploymentType
}

function EmploymentTypesView({ className, currentRow }: EmploymentTypesViewProps) {
  const status =
    currentRow.active_status || (currentRow.is_active ? 'active' : 'inactive')
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.name}</div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {status}
        </Badge>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Created At
          </div>
          <div className='text-sm text-muted-foreground'>
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Updated At
          </div>
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
