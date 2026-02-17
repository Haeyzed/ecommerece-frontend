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
import type { Customer } from '../types'

type CustomersViewDialogProps = {
  currentRow?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomersViewDialogProps) {
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
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information below.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-2">
            <CustomerView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Customer Details</DrawerTitle>
          <DrawerDescription>View customer information below.</DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[80vh] overflow-y-auto px-4">
          <CustomerView currentRow={currentRow} />
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

interface CustomerViewProps {
  className?: string
  currentRow: Customer
}

function CustomerView({ className, currentRow }: CustomerViewProps) {
  const statusBadgeColor = currentRow.is_active
    ? 'border-green-500/50 text-green-700 dark:text-green-400'
    : 'border-muted-foreground/50'

  const addressParts = [
    currentRow.address,
    currentRow.city?.name,
    currentRow.state?.name,
    currentRow.postal_code,
  ].filter(Boolean)
  const addressLine = addressParts.join(', ')
  const countryPart = currentRow.country?.name ? `, ${currentRow.country.name}` : ''

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>

      {currentRow.customer_group && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Customer Group</div>
          <div className="text-sm">{currentRow.customer_group.name}</div>
        </div>
      )}

      {currentRow.company_name && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Company</div>
          <div className="text-sm">{currentRow.company_name}</div>
        </div>
      )}

      {(currentRow.email || currentRow.phone_number) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Contact</div>
          <div className="space-y-1 text-sm">
            {currentRow.email && <p>{currentRow.email}</p>}
            {currentRow.phone_number && <p>{currentRow.phone_number}</p>}
          </div>
        </div>
      )}

      {(addressLine || countryPart) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Address</div>
          <div className="text-sm text-muted-foreground">
            {addressLine}
            {countryPart}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge variant="outline" className={cn('capitalize', statusBadgeColor)}>
          {currentRow.active_status ?? (currentRow.is_active ? 'active' : 'inactive')}
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
