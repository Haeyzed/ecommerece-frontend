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
import { statusTypes } from '@/features/hrm/document-types/constants'
import { type DocumentType } from '@/features/hrm/document-types/types'

type DocumentTypesViewDialogProps = {
  currentRow?: DocumentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentTypesViewDialog({
                                       currentRow,
                                       open,
                                       onOpenChange,
                                     }: DocumentTypesViewDialogProps) {
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
              <DialogTitle>Document Type Details</DialogTitle>
              <DialogDescription>
                View detailed information about this document type below.
              </DialogDescription>
            </DialogHeader>

            <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
              <DocumentTypesView currentRow={currentRow} />
            </div>
          </DialogContent>
        </Dialog>
    )
  }

  return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader className='text-left'>
            <DrawerTitle>Document Type Details</DrawerTitle>
            <DrawerDescription>View detailed information about this document type below.</DrawerDescription>
          </DrawerHeader>

          <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
            <DocumentTypesView currentRow={currentRow} />
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

interface DocumentTypesViewProps {
  className?: string
  currentRow: DocumentType
}

function DocumentTypesView({ className, currentRow }: DocumentTypesViewProps) {
  const status = currentRow.active_status || (currentRow.is_active ? 'active' : 'inactive')
  const statusBadgeColor = statusTypes.get(status)

  return (
      <div className={cn('space-y-6', className)}>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <div className='text-xl font-semibold'>{currentRow.name}</div>
            <div className='text-sm text-muted-foreground'>
              Code: <span className='font-mono font-medium'>{currentRow.code}</span>
            </div>
          </div>
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
            {status}
          </Badge>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Code</div>
            <div className='text-sm font-medium'>{currentRow.code}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Requires Expiry</div>
            <div className='text-sm font-medium'>{currentRow.requires_expiry ? 'Yes' : 'No'}</div>
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