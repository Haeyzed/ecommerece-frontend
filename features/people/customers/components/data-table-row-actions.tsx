'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Delete02Icon,
  DollarCircleIcon,
  FileDown,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  ViewIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Customer } from '../types'
import { useCustomersContext } from './customers-provider'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<Customer>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCustomersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canView = userPermissions.includes('view customer details')
  const canUpdate = userPermissions.includes('update customers')
  const canDelete = userPermissions.includes('delete customers')
  const canDueReport = userPermissions.includes('due-report')

  if (!canView && !canUpdate && !canDelete && !canDueReport) return null

  const id = row.original.id
  const customer = row.original

  const openAddDeposit = () => {
    setCurrentRow(customer)
    setOpen('add-deposit')
  }
  const openViewDeposit = () => {
    setCurrentRow(customer)
    setOpen('view-deposit')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <HugeiconsIcon
            icon={MoreHorizontalIcon}
            strokeWidth={2}
            className="h-4 w-4"
          />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {canView && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('view')
              }}
            >
              View
              <DropdownMenuShortcut>
                <HugeiconsIcon icon={ViewIcon} strokeWidth={2} size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openViewDeposit}>
              View Deposit
              <DropdownMenuShortcut>
                <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {(canUpdate || canDelete) && <DropdownMenuSeparator />}
          </>
        )}

        {canUpdate && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('edit')
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  strokeWidth={2}
                  size={16}
                />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {canDueReport && (
              <DropdownMenuItem asChild>
                <Link href={`/reports/customer-due?customer_id=${id}`}>
                  Due Report
                  <DropdownMenuShortcut>
                    <HugeiconsIcon icon={FileDown} strokeWidth={2} size={16} />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={openAddDeposit}>
              Add Deposit
              <DropdownMenuShortcut>
                <HugeiconsIcon
                  icon={DollarCircleIcon}
                  strokeWidth={2}
                  size={16}
                />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {canDelete && <DropdownMenuSeparator />}
          </>
        )}

        {canDelete && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className="text-destructive focus:text-destructive"
          >
            Delete
            <DropdownMenuShortcut>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
