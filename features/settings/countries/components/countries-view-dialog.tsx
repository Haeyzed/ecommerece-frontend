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
import { type Country } from '../types'
import { Map } from '@/components/ui/map'

type CountriesViewDialogProps = {
  currentRow?: Country
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CountriesViewDialog({
                                      currentRow,
                                      open,
                                      onOpenChange,
                                    }: CountriesViewDialogProps) {
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
            <DialogTitle>Country Details</DialogTitle>
            <DialogDescription>
              View country information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <CountryView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Country Details</DrawerTitle>
          <DrawerDescription>View country information below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <CountryView currentRow={currentRow} />
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

interface CountryViewProps {
  className?: string
  currentRow: Country
}

function CountryView({ className, currentRow }: CountryViewProps) {
  const status = currentRow.status === 1 ? 'active' : 'inactive'
  const StatusIcon = currentRow.status === 1 ? CheckmarkCircle02Icon : MultiplicationSignIcon
  const statusBadgeColor = statusTypes.get(status)

  const lat = parseFloat(currentRow.latitude || '')
  const lng = parseFloat(currentRow.longitude || '')
  const hasCoordinates = !isNaN(lat) && !isNaN(lng)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center gap-4'>
        {currentRow.emoji && (
          <div className='flex size-16 items-center justify-center rounded-md border bg-muted text-3xl'>
            {currentRow.emoji}
          </div>
        )}
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.name}</div>
          {currentRow.native && (
            <div className='text-sm text-muted-foreground'>{currentRow.native}</div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>ISO2 Code</div>
          <div className='text-sm font-medium uppercase'>{currentRow.iso2}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>ISO3 Code</div>
          <div className='text-sm font-medium uppercase'>{currentRow.iso3 || '-'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Region</div>
          <div className='text-sm'>{currentRow.region || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Subregion</div>
          <div className='text-sm'>{currentRow.subregion || '-'}</div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Phone Code</div>
          <div className='text-sm tabular-nums'>
            {currentRow.phone_code ? `+${currentRow.phone_code}` : '-'}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Emoji Unicode</div>
          <div className='text-sm'>{currentRow.emojiU || '-'}</div>
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
          <Map lat={lat} lng={lng} zoom={4} />
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