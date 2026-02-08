'use client'

/**
 * DataTableRowActions
 *
 * Renders the actions dropdown menu (Edit, Delete) for a specific row
 * in the taxes data table.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Row<Tax>} props.row - The table row containing tax data
 */

import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Delete02Icon, 
  MoreHorizontalIcon, 
  PencilEdit02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Tax } from '../types'
import { useTaxes } from './taxes-provider'
import { useAuthSession } from '@/features/auth/api' // Import session hook

type DataTableRowActionsProps = {
  row: Row<Tax>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useTaxes()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canView = userPermissions.includes('taxes-index')
  const canUpdate = userPermissions.includes('taxes-update')
  const canDelete = userPermissions.includes('taxes-delete')
  if (!canView && !canUpdate && !canDelete) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
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
                <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} size={16} />
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
            className='text-destructive focus:text-destructive'
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