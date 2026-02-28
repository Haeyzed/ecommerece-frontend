'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { MoreHorizontalIcon, Receipt, SparklesIcon } from '@hugeicons/core-free-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { type PayrollRun } from '@/features/hrm/payroll/types'
import { usePayroll } from '@/features/hrm/payroll/components/payroll-provider'
import { useGeneratePayrollEntries } from '@/features/hrm/payroll/api'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<PayrollRun>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter()
  const run = row.original
  const { setCurrentRow, setOpen } = usePayroll()
  const generateEntries = useGeneratePayrollEntries()

  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []

  const canViewEntries = userPermissions.includes('view payroll') || userPermissions.includes('view payroll runs')
  const canGenerateEntries = userPermissions.includes('create payrolls') || userPermissions.includes('view payroll runs')

  if (!canViewEntries && !canGenerateEntries) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {canViewEntries && (
          <DropdownMenuItem
            onClick={() => router.push(`/hrm/payroll/${run.id}`)}
          >
            View entries
            <DropdownMenuShortcut>
              <HugeiconsIcon icon={Receipt} strokeWidth={2} size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {canGenerateEntries && (
          <DropdownMenuItem
            onClick={() => generateEntries.mutate(run.id)}
            disabled={generateEntries.isPending}
          >
            Generate entries
            <DropdownMenuShortcut>
              <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
