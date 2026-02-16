'use client'

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
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import type { Timezone } from '../types'

type TimezonesViewDialogProps = {
  currentRow?: Timezone | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimezonesViewDialog({ currentRow, open, onOpenChange }: TimezonesViewDialogProps) {
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
            <DialogTitle>Timezone Details</DialogTitle>
            <DialogDescription>View timezone information below.</DialogDescription>
          </DialogHeader>
          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <TimezoneView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Timezone Details</DrawerTitle>
          <DrawerDescription>View timezone information below.</DrawerDescription>
        </DrawerHeader>
        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <TimezoneView currentRow={currentRow} />
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

interface TimezoneViewProps {
  className?: string
  currentRow: Timezone
}

function TimezoneView({ className, currentRow }: TimezoneViewProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>
      {currentRow.country && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Country</div>
          <div className="text-sm">{currentRow.country.name}</div>
        </div>
      )}
    </div>
  )
}
