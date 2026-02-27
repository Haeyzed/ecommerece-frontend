'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { useMediaQuery } from '@/hooks/use-media-query'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

type LeavesCsvPreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any[]
  onConfirm: () => void
  isPending: boolean
}

export function LeavesCsvPreviewDialog({
                                             open,
                                             onOpenChange,
                                             data,
                                             onConfirm,
                                             isPending,
                                           }: LeavesCsvPreviewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const headers = data.length > 0 ? Object.keys(data[0]) : []

  // JSX Variable for content prevents ESLint remount/re-render bugs
  const previewContent = (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className='capitalize'>
                {header.replace(/_/g, ' ')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 5).map((row, i) => (
            <TableRow key={i}>
              {headers.map((header) => (
                <TableCell key={`${i}-${header}`} className='max-w-[200px] truncate'>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length > 5 && (
            <TableRow>
              <TableCell colSpan={headers.length} className='text-center text-muted-foreground'>
                ... and {data.length - 5} more rows
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Preview Import Leaves Data</DialogTitle>
            <DialogDescription>
              Review the leaves data before importing. Showing first 5 rows of {data.length} entries.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[60vh] overflow-y-auto py-2'>
            {previewContent}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Importing...
                </>
              ) : (
                <>
                  Confirm Import
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-2 size-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Preview Import Leaves Data</DrawerTitle>
          <DrawerDescription>
            Review the leaves data before importing. Showing first 5 rows of {data.length} entries.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[70vh] overflow-y-auto px-4'>
          {previewContent}
        </div>

        <DrawerFooter>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                Importing...
              </>
            ) : (
              <>
                Confirm Import
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="ml-2 size-4" />
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline' disabled={isPending}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}