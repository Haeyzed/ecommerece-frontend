'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  UnavailableIcon,
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
  useBulkActivateCountries,
  useBulkDeactivateCountries
} from '../api'
import { type Country } from '../types'
import { CountriesExportDialog } from './countries-export-dialog'
import { CountriesMultiDeleteDialog } from './countries-multi-delete-dialog'
import { useAuthSession } from '@/features/auth/api'
import { Spinner } from '@/components/ui/spinner'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
                                              table,
                                            }: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as Country).id)

  const { mutate: activateCountries, isPending: isActivating } = useBulkActivateCountries()
  const { mutate: deactivateCountries, isPending: isDeactivating } = useBulkDeactivateCountries()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canUpdate = userPermissions.includes('update countries')
  const canDelete = userPermissions.includes('delete countries')
  const canExport = userPermissions.includes('export countries')

  if (!canUpdate && !canDelete && !canExport) return null

  const isBusy = isActivating || isDeactivating

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      activateCountries(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    } else {
      deactivateCountries(selectedIds, {
        onSuccess: () => table.resetRowSelection(),
      })
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='country'>
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
                  aria-label='Activate selected countries'
                  title='Activate selected countries'
                >
                  {isActivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Activate selected countries</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Activate selected countries</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={isBusy}
                  className='size-8'
                  aria-label='Deactivate selected countries'
                  title='Deactivate selected countries'
                >
                  {isDeactivating ? (
                    <Spinner className='size-4' />
                  ) : (
                    <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                  )}
                  <span className='sr-only'>Deactivate selected countries</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deactivate selected countries</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setShowExportDialog(true)}
                disabled={isBusy}
                className='size-8'
                aria-label='Export selected countries'
                title='Export selected countries'
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className='sr-only'>Export selected countries</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected countries</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isBusy}
                className='size-8'
                aria-label='Delete selected countries'
                title='Delete selected countries'
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className='sr-only'>Delete selected countries</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected countries</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <CountriesMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <CountriesExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  )
}