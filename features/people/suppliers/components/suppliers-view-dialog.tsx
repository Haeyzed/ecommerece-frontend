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
import { ImageZoom } from '@/components/ui/image-zoom'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Supplier } from '../schemas'

type SuppliersViewDialogProps = {
  currentRow?: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SuppliersViewDialog({
  currentRow,
  open,
  onOpenChange,
}: SuppliersViewDialogProps) {
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
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              View supplier information below.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto py-1 pe-2">
            <SupplierView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Supplier Details</DrawerTitle>
          <DrawerDescription>View supplier information below.</DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[80vh] overflow-y-auto px-4">
          <SupplierView currentRow={currentRow} />
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

interface SupplierViewProps {
  className?: string
  currentRow: Supplier
}

function SupplierView({ className, currentRow }: SupplierViewProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn('space-y-6', className)}>
      {currentRow.image_url && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Image</div>
          <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
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
                className="h-full w-full object-cover"
                unoptimized
              />
            </ImageZoom>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>

      {currentRow.company_name && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Company</div>
          <div className="text-sm">{currentRow.company_name}</div>
        </div>
      )}

      {(currentRow.email || currentRow.phone_number || currentRow.wa_number) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Contact</div>
          <div className="space-y-1 text-sm">
            {currentRow.email && <p>{currentRow.email}</p>}
            {currentRow.phone_number && <p>{currentRow.phone_number}</p>}
            {currentRow.wa_number && <p>WhatsApp: {currentRow.wa_number}</p>}
          </div>
        </div>
      )}

      {currentRow.vat_number && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">VAT number</div>
          <div className="text-sm text-muted-foreground">{currentRow.vat_number}</div>
        </div>
      )}

      {currentRow.address && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Address</div>
          <div className="text-sm text-muted-foreground">
            {[currentRow.address, currentRow.city, currentRow.state, currentRow.postal_code]
              .filter(Boolean)
              .join(', ')}
            {currentRow.country && `, ${currentRow.country}`}
          </div>
        </div>
      )}

      {(currentRow.opening_balance != null && currentRow.opening_balance !== 0) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Opening Balance</div>
          <div className="text-sm">{currentRow.opening_balance}</div>
        </div>
      )}

      {(currentRow.pay_term_no != null || currentRow.pay_term_period) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Payment Term</div>
          <div className="text-sm">
            {[currentRow.pay_term_no, currentRow.pay_term_period].filter(Boolean).join(' ')}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            currentRow.is_active
              ? 'border-green-500/50 text-green-700 dark:text-green-400'
              : 'border-muted-foreground/50'
          )}
        >
          {currentRow.is_active ? 'Active' : 'Inactive'}
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
