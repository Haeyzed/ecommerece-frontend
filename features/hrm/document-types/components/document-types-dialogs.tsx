'use client'

import { DocumentTypesActionDialog } from '@/features/hrm/document-types'
import { DocumentTypesDeleteDialog } from '@/features/hrm/document-types'
import { DocumentTypesExportDialog } from '@/features/hrm/document-types'
import { DocumentTypesImportDialog } from '@/features/hrm/document-types'
import { DocumentTypesViewDialog } from './document-types-view-dialog'
import { useDocumentTypes } from './document-types-provider'
import { useAuthSession } from '@/features/auth/api'

export function DocumentTypesDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDocumentTypes()
    const { data: session } = useAuthSession()
    const userPermissions = session?.user?.user_permissions || []

    const canCreate = userPermissions.includes('create document types')
    const canImport = userPermissions.includes('import document types')
    const canExport = userPermissions.includes('export document types')
    const canUpdate = userPermissions.includes('update document types')
    const canDelete = userPermissions.includes('delete document types')
    const canView = userPermissions.includes('view document types')

    return (
        <>
            {canCreate && (
                <DocumentTypesActionDialog
                    key='document-type-add'
                    open={open === 'add'}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setOpen(null)
                    }}
                />
            )}

            {canImport && (
                <DocumentTypesImportDialog
                    key='document-type-import'
                    open={open === 'import'}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setOpen(null)
                    }}
                />
            )}

            {canExport && (
                <DocumentTypesExportDialog
                    key='document-type-export'
                    open={open === 'export'}
                    onOpenChange={(state) => setOpen(state ? 'export' : null)}
                    ids={[]}
                />
            )}

            {currentRow && (
                <>
                    {canUpdate && (
                        <DocumentTypesActionDialog
                            key={`document-type-edit-${currentRow.id}`}
                            open={open === 'edit'}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setOpen(null)
                                    setTimeout(() => {
                                        setCurrentRow(null)
                                    }, 500)
                                }
                            }}
                            currentRow={currentRow}
                        />
                    )}

                    {canView && (
                        <DocumentTypesViewDialog
                            key={`document-type-view-${currentRow.id}`}
                            open={open === 'view'}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setOpen(null)
                                    setTimeout(() => {
                                        setCurrentRow(null)
                                    }, 500)
                                }
                            }}
                            currentRow={currentRow}
                        />
                    )}

                    {canDelete && (
                        <DocumentTypesDeleteDialog
                            key={`document-type-delete-${currentRow.id}`}
                            open={open === 'delete'}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setOpen(null)
                                    setTimeout(() => {
                                        setCurrentRow(null)
                                    }, 500)
                                }
                            }}
                            currentRow={currentRow}
                        />
                    )}
                </>
            )}
        </>
    )
}