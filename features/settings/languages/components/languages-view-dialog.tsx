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
import type { Language } from '../types'

type LanguagesViewDialogProps = {
  currentRow?: Language | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LanguagesViewDialog({ currentRow, open, onOpenChange }: LanguagesViewDialogProps) {
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
            <DialogTitle>Language Details</DialogTitle>
            <DialogDescription>View language information below.</DialogDescription>
          </DialogHeader>
          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <LanguageView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Language Details</DrawerTitle>
          <DrawerDescription>View language information below.</DrawerDescription>
        </DrawerHeader>
        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <LanguageView currentRow={currentRow} />
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

interface LanguageViewProps {
  className?: string
  currentRow: Language
}

function LanguageView({ className, currentRow }: LanguageViewProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Code</div>
          <div className="text-sm font-mono">{currentRow.code}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Direction</div>
          <div className="text-sm">{currentRow.dir ?? '-'}</div>
        </div>
      </div>
      {currentRow.name_native && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Native Name</div>
          <div className="text-sm">{currentRow.name_native}</div>
        </div>
      )}
    </div>
  )
}
