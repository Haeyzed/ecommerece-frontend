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
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useCustomerDeposits } from '../api'
import type { Customer, CustomerDeposit } from '../types'

type CustomersViewDepositDialogProps = {
  currentRow?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function CustomersViewDepositDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomersViewDepositDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="text-start">
            <DialogTitle>View Deposits</DialogTitle>
            <DialogDescription>
              Deposit history for {currentRow.name}. Deposited balance:{' '}
              {(currentRow.deposited_balance ?? currentRow.deposit ?? 0).toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-2">
            <DepositListView customerId={currentRow.id} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>View Deposits</DrawerTitle>
          <DrawerDescription>
            Deposit history for {currentRow.name}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto px-4">
          <DepositListView customerId={currentRow.id} />
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

interface DepositListViewProps {
  customerId: number
  className?: string
}

function DepositListView({ customerId, className }: DepositListViewProps) {
  const { data: deposits = [], isLoading } = useCustomerDeposits(customerId)

  return (
    <div className={cn('space-y-4', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Created by</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                Loading…
              </TableCell>
            </TableRow>
          ) : deposits.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No deposits yet
              </TableCell>
            </TableRow>
          ) : (
            deposits.map((d: CustomerDeposit) => (
              <TableRow key={d.id}>
                <TableCell>{formatDate(d.created_at)}</TableCell>
                <TableCell className="text-right">
                  {Number(d.amount).toFixed(2)}
                </TableCell>
                <TableCell>{d.note ?? '-'}</TableCell>
                <TableCell>
                  {d.user?.name ?? d.user?.email ?? '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
