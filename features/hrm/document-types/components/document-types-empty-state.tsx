'use client'

import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DataTableEmptyState } from '@/components/data-table'

import { useDocumentTypes } from '@/features/hrm/document-types'

export function DocumentTypesEmptyState() {
  const { setOpen } = useDocumentTypes()

  return (
    <DataTableEmptyState
      title='No document types yet'
      description="You haven't created any document types yet. Get started by creating your first document type."
      primaryAction={{
        label: 'Add Document Type',
        onClick: () => setOpen('add'),
        icon: <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' />,
      }}
      secondaryAction={{
        label: 'Import Document Types',
        onClick: () => setOpen('import'),
        icon: <HugeiconsIcon icon={Download01Icon} className='mr-2 size-4' />,
      }}
      learnMoreLink={{
        href: '#',
        label: 'Learn more',
      }}
    />
  )
}
