"use client"

import { DataTableEmptyState } from '@/components/data-table'
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { useDocumentTypes } from '@/features/hrm/document-types'

export function DocumentTypesEmptyState() {
  const { setOpen } = useDocumentTypes()

  return (
      <DataTableEmptyState
          title="No document types yet"
          description="You haven't created any document types yet. Get started by creating your first document type."
          primaryAction={{
            label: "Add Document Type",
            onClick: () => setOpen('add'),
            icon: <HugeiconsIcon icon={PlusSignIcon} className="size-4 mr-2" />,
          }}
          secondaryAction={{
            label: "Import Document Types",
            onClick: () => setOpen('import'),
            icon: <HugeiconsIcon icon={Download01Icon} className="size-4 mr-2" />,
          }}
          learnMoreLink={{
            href: "#",
            label: "Learn more",
          }}
      />
  )
}