'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCustomerDueReportDialog } from './customer-due-report-provider'
import { useAuthSession } from '@/features/auth/api'

export function CustomerDueReportPrimaryButtons() {
  const { setOpen } = useCustomerDueReportDialog()
  const { data: session } = useAuthSession()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const userPermissions = session?.user?.user_permissions ?? []
  const canExport = userPermissions.includes('due-report')

  if (!canExport) return null

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={isMobile ? 'icon' : 'default'}
        className={!isMobile ? 'space-x-1' : ''}
        onClick={() => setOpen('export')}
        aria-label="Export Customer Due Report"
      >
        <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} size={18} />
        {!isMobile && <span>Export</span>}
      </Button>
    </div>
  )
}
