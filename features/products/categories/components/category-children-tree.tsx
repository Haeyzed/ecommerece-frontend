'use client'

import { TreeView } from '@/components/tree-view'
import type { TreeDataItem } from '@/components/tree-view'
import type { CategoryTreeItem } from '../types'

function mapToTreeData(items: CategoryTreeItem[]): TreeDataItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    iconUrl: item.icon_url ?? undefined,
    children: item.children?.length
      ? mapToTreeData(item.children)
      : undefined,
  }))
}

type CategoryChildrenTreeProps = {
  children?: CategoryTreeItem[]
}

export function CategoryChildrenTree({
  children: categoryChildren = [],
}: CategoryChildrenTreeProps) {
  if (!categoryChildren.length) {
    return null
  }

  const treeData = mapToTreeData(categoryChildren)

  return (
    <>
      <div className="text-sm font-medium text-muted-foreground">
        Child Categories
      </div>
      <TreeView data={treeData} />
    </>
  )
}
