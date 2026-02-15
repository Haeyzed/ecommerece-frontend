'use client'

/**
 * DataTableRowActions
 *
 * Renders the dropdown menu for row-specific actions (Edit, Delete) within the data table.
 * It connects to the CategoriesProvider context to trigger the appropriate dialogs
 * and set the current row context.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Row<Category>} props.row - The table row object containing category data
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
import { type Category } from '../types'
import { useCategories } from './categories-provider'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<Category>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCategories()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canView = userPermissions.includes('view category details')
  const canUpdate = userPermissions.includes('update categories')
  const canDelete = userPermissions.includes('delete categories')
  if (!canView && !canUpdate && !canDelete) return null

  return (
    <>
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
              {/* Show separator if there are subsequent actions */}
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
              {/* Show separator if delete action follows */}
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
    </>
  )
}