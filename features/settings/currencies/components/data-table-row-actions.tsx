'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { MoreHorizontalIcon, ViewIcon } from '@hugeicons/core-free-icons'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Currency } from '../types'
import { useCurrencies } from './currencies-provider'
import { useAuthSession } from '@/features/auth/api'

type DataTableRowActionsProps = {
  row: Row<Currency>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCurrencies()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = userPermissions.includes('view currencies')

  if (!canView) return null

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          View
          <DropdownMenuShortcut>
            <HugeiconsIcon icon={ViewIcon} strokeWidth={2} size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
