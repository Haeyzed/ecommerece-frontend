'use client'

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
            <DialogTitle>Warehouse Details</DialogTitle>
            <DialogDescription>
              View warehouse information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <WarehouseView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Warehouse Details</DrawerTitle>
          <DrawerDescription>View warehouse information below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <WarehouseView currentRow={currentRow} />
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

interface WarehouseViewProps {
  className?: string
  currentRow: Warehouse
}

function WarehouseView({ className, currentRow }: WarehouseViewProps) {
  const status = currentRow.is_active ? 'active' : 'inactive'
  const StatusIcon = currentRow.is_active ? CheckmarkCircle02Icon : MultiplicationSignIcon
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
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
          className={cn('flex w-fit items-center gap-1.5', statusBadgeColor)}
        >
          <HugeiconsIcon icon={StatusIcon} className='size-3' />
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
