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
import {
  CheckmarkCircle02Icon,
  MultiplicationSignIcon,
} from '@hugeicons/core-free-icons'
import { statusTypes } from '../constants'
import type { CustomerGroup } from '../types'

type CustomerGroupsViewDialogProps = {
  currentRow?: CustomerGroup
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

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Customer Group Details</DialogTitle>
            <DialogDescription>
              View customer group information below.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-2">
            <CustomerGroupView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Customer Group Details</DrawerTitle>
          <DrawerDescription>
            View customer group information below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          <CustomerGroupView currentRow={currentRow} />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface CustomerGroupViewProps {
  className?: string
  currentRow: CustomerGroup
}

function CustomerGroupView({ className, currentRow }: CustomerGroupViewProps) {
  const status = currentRow.is_active ? 'active' : 'inactive'
  const StatusIcon = currentRow.is_active
    ? CheckmarkCircle02Icon
    : MultiplicationSignIcon
  const statusBadgeColor = statusTypes.get(status)

  const p = currentRow.percentage
  const percentage =
    typeof p === 'number' ? p : parseFloat(String(p))
  const displayPercentage = Number.isNaN(percentage)
    ? String(p)
    : `${percentage}%`

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Percentage</div>
        <div className="text-sm">{displayPercentage}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge
          variant="outline"
          className={cn('flex w-fit items-center gap-1.5', statusBadgeColor)}
        >
          <HugeiconsIcon icon={StatusIcon} className="size-3" />
          {status}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Created At</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Updated At</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.updated_at
              ? new Date(currentRow.updated_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}
