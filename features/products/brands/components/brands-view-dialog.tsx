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
import { ImageZoom } from '@/components/ui/image-zoom'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { statusTypes } from '../constants'
import { Brand } from '../types'

type BrandsViewDialogProps = {
  currentRow?: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: BrandsViewDialogProps) {
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
            <DialogTitle>Brand Details</DialogTitle>
            <DialogDescription>
              View brand information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <BrandView
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
          <DrawerTitle>Brand Details</DrawerTitle>
          <DrawerDescription>View brand information below.</DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4'>
          <BrandView
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

interface BrandViewProps {
  className?: string
  currentRow: Brand
}

function BrandView({ className, currentRow }: BrandViewProps) {
  const { resolvedTheme } = useTheme()
  const statusBadgeColor = statusTypes.get(currentRow.status)

  return (
    <div className={cn('space-y-6', className)}>
      {currentRow.image_url && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Image</div>
          <div className='relative h-48 w-full overflow-hidden rounded-md border bg-muted'>
            <ImageZoom
              backdropClassName={cn(
                resolvedTheme === 'dark'
                  ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                  : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
              )}
            >
              <Image
                src={currentRow.image_url}
                alt={currentRow.name}
                width={800}
                height={400}
                className='h-full w-full object-cover'
                unoptimized
              />
            </ImageZoom>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Name</div>
        <div className='text-sm font-medium'>{currentRow.name}</div>
      </div>

      {currentRow.slug && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Slug</div>
          <div className='text-sm font-mono text-muted-foreground'>{currentRow.slug}</div>
        </div>
      )}

      {currentRow.short_description && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Description</div>
          <div className='text-sm text-muted-foreground whitespace-pre-wrap'>
            {currentRow.short_description}
          </div>
        </div>
      )}

      {currentRow.page_title && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Page Title</div>
          <div className='text-sm'>{currentRow.page_title}</div>
        </div>
      )}

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Status</div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {currentRow.status}
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