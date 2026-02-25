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
import { statusTypes } from '@/features/hrm/departments'
import { type Department } from '@/features/hrm/departments'

type DepartmentsViewDialogProps = {
  currentRow?: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: DepartmentsViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null
  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>Department Details</DialogTitle>
            <DialogDescription>
              View department information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <DepartmentsView
              currentRow={currentRow}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Department Details</DrawerTitle>
          <DrawerDescription>View department information below.</DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4'>
          <DepartmentsView
            currentRow={currentRow}
          />
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

interface DepartmentsViewProps {
  className?: string
  currentRow: Department
}

function DepartmentsView({ className, currentRow }: DepartmentsViewProps) {
  const status = currentRow.is_active ? 'active' : 'inactive'
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Name</div>
          <div className='text-sm font-medium'>{currentRow.name}</div>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Status</div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {status}
        </Badge>
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