'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { type Country } from '../types'

type CountriesViewDialogProps = { currentRow?: Country; open: boolean; onOpenChange: (open: boolean) => void }

export function CountriesViewDialog({ currentRow, open, onOpenChange }: CountriesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>Country Details</DialogTitle>
            <DialogDescription>View country information below.</DialogDescription>
          </DialogHeader>
          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <CountryView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Country Details</DrawerTitle>
          <DrawerDescription>View country information below.</DrawerDescription>
        </DrawerHeader>
        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <CountryView currentRow={currentRow} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild><Button variant='outline'>Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function CountryView({ currentRow }: { currentRow: Country }) {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Name</div>
        <div className='text-sm font-medium'>{currentRow.name}</div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>ISO2</div>
          <div className='text-sm font-mono'>{currentRow.iso2}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>ISO3</div>
          <div className='text-sm font-mono'>{currentRow.iso3 ?? '-'}</div>
        </div>
      </div>
      {currentRow.phone_code && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Phone Code</div>
          <div className='text-sm'>{currentRow.phone_code}</div>
        </div>
      )}
      {currentRow.region && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Region</div>
          <div className='text-sm'>{currentRow.region}</div>
        </div>
      )}
    </div>
  )
}
