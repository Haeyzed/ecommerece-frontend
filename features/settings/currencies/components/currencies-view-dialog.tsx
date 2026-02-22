"use client"

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
import { type Currency } from '../types'

type CurrenciesViewDialogProps = {
  currentRow?: Currency
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurrenciesViewDialog({
                                       currentRow,
                                       open,
                                       onOpenChange,
                                     }: CurrenciesViewDialogProps) {
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
            <DialogTitle>Currency Details</DialogTitle>
            <DialogDescription>
              View currency information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <CurrencyView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Currency Details</DrawerTitle>
          <DrawerDescription>View currency information below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <CurrencyView currentRow={currentRow} />
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

interface CurrencyViewProps {
  className?: string
  currentRow: Currency
}

function CurrencyView({ className, currentRow }: CurrencyViewProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className='space-y-1'>
        <div className='text-xl font-semibold'>{currentRow.name}</div>
        <div className='text-sm text-muted-foreground'>
          Country: {currentRow.country?.name || 'Unknown Country'}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Code</div>
          <div className='text-sm font-medium uppercase'>{currentRow.code}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Symbol</div>
          <div className='text-sm'>{currentRow.symbol}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Native Symbol</div>
          <div className='text-sm'>{currentRow.symbol_native || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Precision</div>
          <div className='text-sm'>{currentRow.precision ?? '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Decimal Mark</div>
          <div className='text-sm'>{currentRow.decimal_mark || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Thousands Separator</div>
          <div className='text-sm'>{currentRow.thousands_separator || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Symbol First</div>
          <div className='text-sm'>{currentRow.symbol_first ? 'Yes' : 'No'}</div>
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