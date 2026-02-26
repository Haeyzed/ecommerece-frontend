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
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { statusTypes } from '@/features/settings/acl/roles/constants'
import { type Role } from '@/features/settings/acl/roles/types'

type RolesViewDialogProps = {
  currentRow?: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolesViewDialog({
                                  currentRow,
                                  open,
                                  onOpenChange,
                                }: RolesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='text-start'>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              View detailed information about this role below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <RolesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Role Details</DrawerTitle>
          <DrawerDescription>View detailed information about this role below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <RolesView currentRow={currentRow} />
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

interface RolesViewProps {
  className?: string
  currentRow: Role
}

function RolesView({ className, currentRow }: RolesViewProps) {
  const status = currentRow.active_status || (currentRow.is_active ? 'active' : 'inactive')
  const statusBadgeColor = statusTypes.get(status)

  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='text-xl font-semibold'>{currentRow.name}</div>
          <div className='text-sm text-muted-foreground'>
            Guard: <span className='font-mono'>{currentRow.guard_name}</span>
          </div>
        </div>
        <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
          {status}
        </Badge>
      </div>

      <Separator />

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Description</div>
        <div className='text-sm'>{currentRow.description || 'No description provided.'}</div>
      </div>

      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground'>Assigned Permissions</div>
        <div className='text-sm font-medium'>
          {currentRow.permissions_count ?? (currentRow.permissions ? currentRow.permissions.length : 0)} Permissions
        </div>
        {currentRow.permissions && currentRow.permissions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {currentRow.permissions.map((p) => (
              <Badge key={p.id} variant="secondary" className="font-normal">
                {p.name}
              </Badge>
            ))}
          </div>
        )}
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