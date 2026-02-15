'use client'

import { TreeView } from '@/components/tree-view'
import type { CategoryTreeItem } from '../types'

type CategoryChildrenTreeProps = {
  children?: CategoryTreeItem[]
}

export function CategoryChildrenTree({
  children: categoryChildren = [],
}: CategoryChildrenTreeProps) {
  if (!categoryChildren.length) {
    return null
  }

  return (
    <>
      <div className="text-sm font-medium text-muted-foreground">
        Child Categories
      </div>
        <TreeView data={categoryChildren} />
    </>
  )
}
