'use client'

/**
 * DataTableRowActions
 *
 * Renders the actions dropdown menu (View) for a specific row in the audit log table.
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { MoreHorizontalIcon, ViewIcon } from '@hugeicons/core-free-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Audit } from '../types'
import { useActivityLog } from './activity-log-provider'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<Audit>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useActivityLog()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions ?? []
  const canView = userPermissions.includes('activity-log-index')

  if (!canView) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <HugeiconsIcon
            icon={MoreHorizontalIcon}
            strokeWidth={2}
            className='h-4 w-4'
          />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
