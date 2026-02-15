'use client'

import { TreeView } from '@/components/tree-view'
import { cn } from '@/lib/utils'
import type { CategoryTreeItem } from '../types'

type CategoryChildrenTreeProps = {
  children?: CategoryTreeItem[]
  className?: string
}

export function CategoryChildrenTree({
  children: categoryChildren = [],
  className,
}: CategoryChildrenTreeProps) {
  if (!categoryChildren.length) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-sm font-medium text-muted-foreground">
        Child Categories
      </div>
      <div className="rounded-md border p-2">
        <TreeView data={categoryChildren} />
      </div>
    </div>
  )
}
