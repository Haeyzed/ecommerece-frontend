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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCustomerDeposits } from '../api'
import type { Customer } from '../types'

type CustomersViewDepositDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
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
  open,
  onOpenChange,
  customer,
}: CustomersViewDepositDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { data: deposits = [], isLoading } = useCustomerDeposits(customer.id)

  const tableContent = (
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
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              Loading…
            </TableCell>
          </TableRow>
        ) : deposits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No deposits yet
            </TableCell>
          </TableRow>
        ) : (
          deposits.map((d) => (
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
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="text-start">
            <DialogTitle>View Deposits</DialogTitle>
            <DialogDescription>
              Deposit history for {customer.name}. Deposited balance:{' '}
              {(customer.deposited_balance ?? customer.deposit ?? 0).toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto flex-1 min-h-0">
            {tableContent}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>View Deposits</DrawerTitle>
          <DrawerDescription>
            Deposit history for {customer.name}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto flex-1 min-h-0 px-4 pb-4">
          {tableContent}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
