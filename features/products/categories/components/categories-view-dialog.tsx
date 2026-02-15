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
import { TreeView, type TreeDataItem } from '@/components/tree-view'
import { Spinner } from '@/components/ui/spinner'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Category } from '../types'
import { featuredTypes, statusTypes, syncTypes } from '../constants'
import { useCategoryTree, type CategoryTreeNode } from '../api'

type CategoriesViewDialogProps = {
  currentRow?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Tree node with attached category for details panel */
type CategoryTreeDataItem = TreeDataItem & { category: Category }

function toTreeDataItems(nodes: CategoryTreeNode[]): CategoryTreeDataItem[] {
  return nodes.map((node) => ({
    id: String(node.id),
    name: node.name,
    category: node as Category,
    children: node.children?.length
      ? toTreeDataItems(node.children)
      : undefined,
  }))
}

export function CategoriesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [displayedCategory, setDisplayedCategory] = useState<Category | null>(
    currentRow ?? null
  )
  const { data: treeData, isLoading: isTreeLoading } = useCategoryTree(true)

  useEffect(() => {
    if (currentRow) {
      setDisplayedCategory(currentRow)
    }
  }, [currentRow])

  const treeItems = useMemo(
    () => (treeData ? toTreeDataItems(treeData) : []),
    [treeData]
  )

  const handleSelectChange = useCallback((item: TreeDataItem | undefined) => {
    const catItem = item as CategoryTreeDataItem | undefined
    if (catItem?.category) {
      setDisplayedCategory(catItem.category)
    }
  }, [])

  if (!currentRow && !displayedCategory) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  const content = (
    <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
      {/* Tree navigation */}
      <div className='min-w-0 flex-1 sm:min-w-[200px] sm:max-w-[280px]'>
        <div className='text-sm font-medium text-muted-foreground mb-2'>
          Category Tree
        </div>
        {isTreeLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Spinner className='size-6' />
          </div>
        ) : treeItems.length > 0 ? (
          <div className='rounded-md border bg-muted/30 p-2 max-h-[300px] overflow-y-auto'>
            <TreeView
              data={treeItems}
              initialSelectedItemId={displayedCategory ? String(displayedCategory.id) : undefined}
              onSelectChange={handleSelectChange}
              expandAll={false}
              className='text-sm'
            />
          </div>
        ) : (
          <p className='text-sm text-muted-foreground py-4'>No categories</p>
        )}
      </div>

      {/* Details panel */}
      <div className='min-w-0 flex-1 overflow-y-auto'>
        {displayedCategory && <CategoryView currentRow={displayedCategory} />}
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              Browse the category tree and view details below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            {content}
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
          <DrawerDescription>
            Browse the category tree and view details below.
          </DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4 pb-4'>{content}</div>

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
}

function CategoryView({ className, currentRow }: CategoryViewProps) {
  const { resolvedTheme } = useTheme()
  const statusBadgeColor = statusTypes.get(currentRow.active_status)
  const featuredStatusBadgeColor = featuredTypes.get(currentRow.featured_status)
  const syncStatusBadgeColor = syncTypes.get(currentRow.sync_status)

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

      {currentRow.parent?.name && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Parent Category</div>
          <div className='text-sm font-medium'>{currentRow.parent.name}</div>
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

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Status</div>
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {currentRow.active_status}
        </Badge>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Featured</div>
          <Badge variant='outline' className={cn('capitalize', featuredStatusBadgeColor)}>
          {currentRow.featured_status}
        </Badge>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Sync Disabled</div>
          <Badge variant='outline' className={cn('capitalize', syncStatusBadgeColor)}>
          {currentRow.sync_status}
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