'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { CustomerGroup } from '../types'

type CustomerGroupsViewDialogProps = {
  currentRow: CustomerGroup | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerGroupsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomerGroupsViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const p = currentRow.percentage
  const percentage =
    typeof p === 'number' ? p : parseFloat(String(p))
  const displayPercentage = Number.isNaN(percentage)
    ? String(p)
    : `${percentage}%`

  const content = (
    <div className="space-y-2 text-sm">
      <p>
        <span className="text-muted-foreground">Name:</span>{' '}
        {currentRow.name}
      </p>
      <p>
        <span className="text-muted-foreground">Percentage:</span>{' '}
        {displayPercentage}
      </p>
      <p>
        <span className="text-muted-foreground">Status:</span>{' '}
        {currentRow.is_active ? 'Active' : 'Inactive'}
      </p>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Customer Group Details</DialogTitle>
            <DialogDescription>
              View customer group information.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Customer Group Details</DrawerTitle>
          <DrawerDescription>
            View customer group information.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>
      </DrawerContent>
    </Drawer>
  )
}
