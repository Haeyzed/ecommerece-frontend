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
import { statusTypes } from '../constants'
import { Unit } from '../types'

type UnitsViewDialogProps = {
  currentRow?: Unit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnitsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: UnitsViewDialogProps) {
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
            <DialogTitle>Unit Details</DialogTitle>
            <DialogDescription>
              View unit information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <UnitView
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
          <DrawerTitle>Unit Details</DrawerTitle>
          <DrawerDescription>View unit information below.</DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4'>
          <UnitView
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

interface UnitViewProps {
  className?: string
  currentRow: Unit
}

function UnitView({ className, currentRow }: UnitViewProps) {
  const status = currentRow.is_active ? 'active' : 'inactive'
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Name</div>
          <div className='text-sm font-medium'>{currentRow.name}</div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Code</div>
          <div className='text-sm font-medium'>{currentRow.code}</div>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Base Unit</div>
        <div className='text-sm text-muted-foreground'>
          {currentRow.base_unit_relation?.name || currentRow.base_unit || 'None (Base Unit)'}
        </div>
      </div>

      {(currentRow.operator || currentRow.operation_value) && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Operator</div>
            <div className='text-sm font-mono'>{currentRow.operator || '-'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Value</div>
            <div className='text-sm font-mono'>{currentRow.operation_value || '-'}</div>
          </div>
        </div>
      )}

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