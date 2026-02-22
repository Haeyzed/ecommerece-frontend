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
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { type State } from '../types'
import { Map } from '@/components/ui/map'

type StatesViewDialogProps = {
  currentRow?: State
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatesViewDialog({
                                   currentRow,
                                   open,
                                   onOpenChange,
                                 }: StatesViewDialogProps) {
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
            <DialogTitle>State Details</DialogTitle>
            <DialogDescription>
              View state information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <StateView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>State Details</DrawerTitle>
          <DrawerDescription>View state information below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <StateView currentRow={currentRow} />
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

interface StateViewProps {
  className?: string
  currentRow: State
}

function StateView({ className, currentRow }: StateViewProps) {
  const lat = parseFloat(currentRow.latitude || '')
  const lng = parseFloat(currentRow.longitude || '')
  const hasCoordinates = !isNaN(lat) && !isNaN(lng)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='space-y-1'>
        <div className='text-xl font-semibold'>{currentRow.name}</div>
        <div className='text-sm text-muted-foreground'>
          {currentRow.type ? <span className='capitalize'>{currentRow.type}</span> : 'State'} in {currentRow.country?.name || 'Unknown Country'}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Code</div>
          <div className='text-sm font-medium'>{currentRow.code || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>State Code</div>
          <div className='text-sm font-medium'>{currentRow.state_code || '-'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Country Code</div>
          <div className='text-sm uppercase'>{currentRow.country_code || '-'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Latitude</div>
          <div className='text-sm tabular-nums'>{currentRow.latitude || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Longitude</div>
          <div className='text-sm tabular-nums'>{currentRow.longitude || '-'}</div>
        </div>
      </div>

      {hasCoordinates && (
        <div className='h-[200px] w-full rounded-md border overflow-hidden relative'>
          <Map lat={lat} lng={lng} zoom={6} />
        </div>
      )}

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