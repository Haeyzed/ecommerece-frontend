'use client'

import { Spinner } from '@/components/ui/spinner'
import { TreeView } from '@/components/tree-view'
import type { TreeDataItem } from '@/components/tree-view'
import { useReparentCategory } from '../api'
import type { CategoryTreeItem } from '../types'

function mapToTreeData(items: CategoryTreeItem[]): TreeDataItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    iconUrl: item.icon_url ?? undefined,
    draggable: true,
    children: item.children?.length
      ? mapToTreeData(item.children)
      : undefined,
  }))
}

type CategoryChildrenTreeProps = {
  children?: CategoryTreeItem[]
  /** Parent category id - used when dropping on root to keep as direct child */
  parentId: number
}

export function CategoryChildrenTree({
  children: categoryChildren = [],
  parentId,
}: CategoryChildrenTreeProps) {
  const { mutate: reparent, isPending } = useReparentCategory()

  if (!categoryChildren.length) {
    return null
  }

  const treeData = mapToTreeData(categoryChildren)

  const handleDrag = (sourceItem: TreeDataItem, targetItem: TreeDataItem) => {
    const categoryId = parseInt(sourceItem.id, 10)
    if (Number.isNaN(categoryId)) return

    const isRootDrop = targetItem.id === '' || targetItem.name === 'root'
    const newParentId = isRootDrop ? parentId : parseInt(targetItem.id, 10)
    if (!isRootDrop && Number.isNaN(newParentId)) return

    reparent({
      id: categoryId,
      parent_id: newParentId,
    })
  }

  return (
    <>
      <div className="text-sm font-medium text-muted-foreground">
        Child Categories
        {isPending && (
          <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Spinner className="size-3.5" />
            Updating…
          </span>
        )}
      </div>
      <TreeView
        data={treeData}
        onDocumentDrag={handleDrag}
      />
    </>
  )
}
