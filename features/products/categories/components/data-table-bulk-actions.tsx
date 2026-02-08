'use client'

/**
 * DataTableBulkActions
 *
 * Renders the floating toolbar for bulk operations on selected rows.
 * Provides actions for bulk activation, deactivation, deletion, 
 * as well as managing Featured and Sync statuses.
 *
 * @component
 * @template TData - The type of data in the table
 * @param {Object} props - The component props
 * @param {Table<TData>} props.table - The TanStack table instance containing selection state
 */

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
  StarIcon,
  StarOffIcon,
  DatabaseSyncIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import {
  useBulkActivateCategories,
  useBulkDeactivateCategories,
  useBulkEnableFeaturedCategories,
  useBulkDisableFeaturedCategories,
  useBulkEnableSyncCategories,
  useBulkDisableSyncCategories
} from '../api'
import { type Category } from '../types'
import { CategoriesExportDialog } from './categories-export-dialog'
import { CategoriesMultiDeleteDialog } from './categories-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Category).id)
  const { mutate: activateCategories, isPending: isActivating } = useBulkActivateCategories()
  const { mutate: deactivateCategories, isPending: isDeactivating } = useBulkDeactivateCategories()
  const { mutate: enableFeatured, isPending: isEnablingFeatured } = useBulkEnableFeaturedCategories()
  const { mutate: disableFeatured, isPending: isDisablingFeatured } = useBulkDisableFeaturedCategories()
  const { mutate: enableSync, isPending: isEnablingSync } = useBulkEnableSyncCategories()
  const { mutate: disableSync, isPending: isDisablingSync } = useBulkDisableSyncCategories()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canUpdate = userPermissions.includes('categories-update')
  const canDelete = userPermissions.includes('categories-delete')
  const canExport = userPermissions.includes('categories-export')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy =
    isActivating ||
    isDeactivating ||
    isEnablingFeatured ||
    isDisablingFeatured ||
    isEnablingSync ||
    isDisablingSync

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateCategories(selectedIds, {
        onSuccess: () => table.resetRowSelection()
      })
    } else {
      deactivateCategories(selectedIds, { onSuccess: () => table.resetRowSelection() })
    }
  }

  const handleBulkFeaturedChange = (enable: boolean) => {
    if (enable) {
      enableFeatured(selectedIds, {
        onSuccess: () => table.resetRowSelection()
      })
    } else {
      disableFeatured(selectedIds, {
        onSuccess: () => table.resetRowSelection()
      })
    }
  }

  const handleBulkSyncChange = (enable: boolean) => {
    if (enable) {
      enableSync(selectedIds, {
        onSuccess: () => table.resetRowSelection()
      })
    } else {
      disableSync(selectedIds, {
        onSuccess: () => table.resetRowSelection()
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='category'>
        <ScrollArea className='w-full max-w-[calc(100vw-2rem)] sm:max-w-fit'>
          <div className='flex items-center gap-1 p-1'>
            {canUpdate && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkStatusChange('active')}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Activate selected'
                    >
                      {isActivating ? <Spinner className='size-4' /> : <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Activate selected categories</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkStatusChange('inactive')}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Deactivate selected'
                    >
                      {isDeactivating ? <Spinner className='size-4' /> : <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Deactivate selected categories</p></TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkFeaturedChange(true)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Mark as featured'
                    >
                      {isEnablingFeatured ? <Spinner className='size-4' /> : <HugeiconsIcon icon={StarIcon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Mark selected as featured</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkFeaturedChange(false)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Remove featured status'
                    >
                      {isDisablingFeatured ? <Spinner className='size-4' /> : <HugeiconsIcon icon={StarOffIcon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Remove featured status</p></TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkSyncChange(true)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Enable sync'
                    >
                      {isEnablingSync ? <Spinner className='size-4' /> : <HugeiconsIcon icon={DatabaseSyncIcon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Enable sync for selected</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleBulkSyncChange(false)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Disable sync'
                    >
                      {isDisablingSync ? <Spinner className='size-4' /> : <HugeiconsIcon icon={DatabaseSyncIcon} strokeWidth={2} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Disable sync for selected</p></TooltipContent>
                </Tooltip>
              </>
            )}

            {canExport && (
              <>
                {(canUpdate || canDelete) && <Separator orientation="vertical" className="h-6 mx-1" />}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setShowExportDialog(true)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Export selected'
                    >
                      <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Export selected categories</p></TooltipContent>
                </Tooltip>
              </>
            )}

            {/* Delete Action */}
            {canDelete && (
              <>
                {(canUpdate || canExport) && <Separator orientation="vertical" className="h-6 mx-1" />}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isBusy}
                      className='size-8'
                      aria-label='Delete selected'
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Delete selected categories</p></TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </BulkActionsToolbar>

      {canDelete && (
        <CategoriesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <CategoriesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}