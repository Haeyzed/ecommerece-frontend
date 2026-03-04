'use client'

import { CalendarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function CustomerDueReportEmptyState() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
      <HugeiconsIcon
        icon={CalendarIcon}
        className='mb-4 size-12 text-muted-foreground'
      />
      <h3 className='text-lg font-semibold'>Select date range</h3>
      <p className='mt-1 max-w-sm text-muted-foreground'>
        Use the date range picker and optional customer filter above to run the
        customer due report.
      </p>
    </div>
  )
}
