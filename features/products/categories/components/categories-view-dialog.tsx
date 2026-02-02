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
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { activeStatuses } from '../constants'
import { type Category } from '../types'

type CategoriesViewDialogProps = {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!currentRow) return null

  const status = activeStatuses.find((s) => s.value === (currentRow.is_active ? 'active' : 'inactive'))
  const statusIconData = status?.icon

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              View category information below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <CategoryView
              currentRow={currentRow}
              statusIcon={statusIconData}
              statusLabel={status?.label}
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
          <DrawerTitle>Category Details</DrawerTitle>
          <DrawerDescription>View category information below.</DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4'>
          <CategoryView
            currentRow={currentRow}
            statusIcon={statusIconData}
            statusLabel={status?.label}
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

interface CategoryViewProps {
  className?: string
  currentRow: Category
  statusIcon?: any
  statusLabel?: string
}

function CategoryView({ className, currentRow, statusIcon, statusLabel }: CategoryViewProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Image */}
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
                fill
                className='object-cover'
                sizes="(max-width: 768px) 100vw, 500px"
                unoptimized
              />
            </ImageZoom>
          </div>
        </div>
      )}

      {/* Basic Info */}
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

      {currentRow.parent_name && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Parent Category</div>
          <div className='text-sm font-medium'>{currentRow.parent_name}</div>
        </div>
      )}

      {currentRow.icon_url && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Icon</div>
          <div className='relative h-24 w-24 overflow-hidden rounded-md border bg-muted p-2'>
            <ImageZoom
              backdropClassName={cn(
                resolvedTheme === 'dark'
                  ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                  : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
              )}
            >
              <Image
                src={currentRow.icon_url}
                alt={`${currentRow.name} icon`}
                fill
                className='object-contain'
                sizes="96px"
                unoptimized
              />
            </ImageZoom>
          </div>
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

      {currentRow.woocommerce_category_id && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>WooCommerce Category ID</div>
          <div className='text-sm font-mono'>{currentRow.woocommerce_category_id}</div>
        </div>
      )}

      {/* Badges Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Status</div>
          <Badge
            variant='outline'
            className={cn(
              'flex w-fit items-center gap-1.5',
              currentRow.is_active
                ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'
                : 'bg-neutral-300/40 border-neutral-300'
            )}
          >
            {statusIcon && <HugeiconsIcon icon={statusIcon} className='size-3' />}
            {statusLabel}
          </Badge>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Featured</div>
          <Badge
            variant='outline'
            className={cn(
              'flex w-fit items-center gap-1.5',
              currentRow.featured
                ? 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200'
                : 'bg-neutral-300/40 border-neutral-300'
            )}
          >
            {currentRow.featured ? 'Yes' : 'No'}
          </Badge>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Sync Disabled</div>
          <Badge
            variant='outline'
            className={cn(
              'flex w-fit items-center gap-1.5',
              currentRow.is_sync_disable
                ? 'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200'
                : 'bg-neutral-300/40 border-neutral-300'
            )}
          >
            {currentRow.is_sync_disable ? 'Yes' : 'No'}
          </Badge>
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