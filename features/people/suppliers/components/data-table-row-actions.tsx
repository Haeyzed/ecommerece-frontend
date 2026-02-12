'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Supplier } from '../schemas'
import { useSuppliersContext } from './suppliers-provider'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<Supplier>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useSuppliersContext()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []
  const canView = userPermissions.includes('suppliers-index')
  const canUpdate = userPermissions.includes('suppliers-update')
  const canDelete = userPermissions.includes('suppliers-delete')

  if (!canView && !canUpdate && !canDelete) return null

  const id = row.original.id

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
        )}

        {canUpdate && (
          <DropdownMenuItem asChild>
            <Link href={`/people/suppliers/${id}/edit`}>
              Edit
              <DropdownMenuShortcut>
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  strokeWidth={2}
                  size={16}
                />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
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
