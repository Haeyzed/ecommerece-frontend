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
    useBulkActivateDocumentTypes,
    useBulkDeactivateDocumentTypes
} from '@/features/hrm/document-types/api'
import { type DocumentType } from '@/features/hrm/document-types/types'
import { DocumentTypesExportDialog } from '@/features/hrm/document-types'
import { DocumentTypesMultiDeleteDialog } from '@/features/hrm/document-types'
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
    const selectedIds = selectedRows.map((row) => (row.original as DocumentType).id)

    const { mutate: activateDocumentTypes, isPending: isActivating } = useBulkActivateDocumentTypes()
    const { mutate: deactivateDocumentTypes, isPending: isDeactivating } = useBulkDeactivateDocumentTypes()

    const { data: session } = useAuthSession()
    const userPermissions = session?.user?.user_permissions || []

    const canUpdate = userPermissions.includes('update document types')
    const canDelete = userPermissions.includes('delete document types')
    const canExport = userPermissions.includes('export document types')

    if (!canUpdate && !canDelete && !canExport) return null

    const isBusy = isActivating || isDeactivating

    const handleBulkStatusChange = (status: 'active' | 'inactive') => {
        if (status === 'active') {
            activateDocumentTypes(selectedIds, {
                onSuccess: () => table.resetRowSelection(),
            })
        } else {
            deactivateDocumentTypes(selectedIds, {
                onSuccess: () => table.resetRowSelection(),
            })
        }
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='document type'>
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
                                    aria-label='Activate selected document types'
                                    title='Activate selected document types'
                                >
                                    {isActivating ? (
                                        <Spinner className='size-4' />
                                    ) : (
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                                    )}
                                    <span className='sr-only'>Activate selected document types</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Activate selected document types</p>
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
                                    aria-label='Deactivate selected document types'
                                    title='Deactivate selected document types'
                                >
                                    {isDeactivating ? (
                                        <Spinner className='size-4' />
                                    ) : (
                                        <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
                                    )}
                                    <span className='sr-only'>Deactivate selected document types</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deactivate selected document types</p>
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
                                aria-label='Export selected document types'
                                title='Export selected document types'
                            >
                                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                                <span className='sr-only'>Export selected document types</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export selected document types</p>
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
                                aria-label='Delete selected document types'
                                title='Delete selected document types'
                            >
                                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                                <span className='sr-only'>Delete selected document types</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete selected document types</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </BulkActionsToolbar>

            {canDelete && (
                <DocumentTypesMultiDeleteDialog
                    table={table}
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                />
            )}

            {canExport && (
                <DocumentTypesExportDialog
                    open={showExportDialog}
                    onOpenChange={setShowExportDialog}
                    ids={selectedIds}
                />
            )}
        </>
    )
}