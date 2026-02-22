'use client'

import { type Row } from '@tanstack/react-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableExpandButtonProps<TData> = {
  row: Row<TData>
  canExpand?: boolean
  className?: string
}

/**
 * Renders a button to toggle row expansion. Use with tables that have
 * getExpandedRowModel() and expansion state. When the row is expanded,
 * the icon rotates to indicate state.
 */
export function DataTableExpandButton<TData>({
  row,
  canExpand = true,
  className,
}: DataTableExpandButtonProps<TData>) {
  if (!canExpand) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-7', className)}
      onClick={(e) => {
        e.stopPropagation()
        row.toggleExpanded()
      }}
      aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
      aria-expanded={row.getIsExpanded()}
    >
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className={cn('size-4 transition-transform', row.getIsExpanded() && 'rotate-90')}
      />
    </Button>
  )
}
