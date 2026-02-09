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
import type { Audit } from '../types'
import { formatAuditValues } from '../utils/format-audit-values'

function getAuditableTypeLabel(auditableType: string): string {
  const parts = auditableType.split('\\')
  return parts[parts.length - 1] ?? auditableType
}

type ActivityLogViewDialogProps = {
  currentRow?: Audit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityLogViewDialog({
  currentRow,
  open,
  onOpenChange,
}: ActivityLogViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Audit Details</DialogTitle>
            <DialogDescription>
              View full audit record and value changes.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <AuditView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Audit Details</DrawerTitle>
          <DrawerDescription>
            View full audit record and value changes.
          </DrawerDescription>
        </DrawerHeader>

        <div className='max-h-[80vh] overflow-y-auto px-4'>
          <AuditView currentRow={currentRow} />
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

interface AuditViewProps {
  className?: string
  currentRow: Audit
}

function AuditView({ className, currentRow }: AuditViewProps) {
  const eventVariant =
    currentRow.event === 'created'
      ? 'default'
      : currentRow.event === 'updated'
        ? 'secondary'
        : currentRow.event === 'deleted'
          ? 'destructive'
          : 'outline'

  const hasOld =
    currentRow.old_values && Object.keys(currentRow.old_values).length > 0
  const hasNew =
    currentRow.new_values && Object.keys(currentRow.new_values).length > 0

  return (
    <div className={cn('space-y-6', className)}>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Date</div>
          <div className='text-sm tabular-nums'>
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Event</div>
          <Badge variant={eventVariant}>{currentRow.event}</Badge>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Model</div>
          <div className='text-sm font-medium'>
            {getAuditableTypeLabel(currentRow.auditable_type)}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>ID</div>
          <div className='text-sm tabular-nums'>
            {currentRow.auditable_id ?? '-'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>User</div>
          <div className='text-sm'>
            {currentRow.user?.name ?? '—'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            IP Address
          </div>
          <div className='text-sm tabular-nums text-muted-foreground'>
            {currentRow.ip_address ?? '—'}
          </div>
        </div>
      </div>

      {currentRow.url && (
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>URL</div>
          <a
            href={currentRow.url}
            target='_blank'
            rel='noopener noreferrer'
            className='break-all text-sm text-primary hover:underline'
          >
            {currentRow.url}
          </a>
        </div>
      )}

      {(hasOld || hasNew) && (
        <>
          <Separator />
          <div className='space-y-4'>
            <div className='text-sm font-medium text-muted-foreground'>
              Value Changes
            </div>

            {hasOld && (
              <div className='space-y-1.5'>
                <p className='text-xs font-semibold text-destructive'>
                  Old values
                </p>
                <div className='space-y-1 rounded border bg-muted/30 p-3 text-sm'>
                  {formatAuditValues(currentRow.old_values).map(
                    ({ label, value }) => (
                      <div key={label} className='flex gap-2'>
                        <span className='shrink-0 font-medium text-muted-foreground'>
                          {label}:
                        </span>
                        <span className='break-all'>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {hasNew && (
              <div className='space-y-1.5'>
                <p className='text-xs font-semibold text-green-600 dark:text-green-400'>
                  New values
                </p>
                <div className='space-y-1 rounded border bg-muted/30 p-3 text-sm'>
                  {formatAuditValues(currentRow.new_values).map(
                    ({ label, value }) => (
                      <div key={label} className='flex gap-2'>
                        <span className='shrink-0 font-medium text-muted-foreground'>
                          {label}:
                        </span>
                        <span className='break-all'>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {currentRow.user_agent && (
        <>
          <Separator />
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>
              User Agent
            </div>
            <div className='break-all text-xs text-muted-foreground'>
              {currentRow.user_agent}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
