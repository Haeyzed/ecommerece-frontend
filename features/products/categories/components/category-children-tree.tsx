'use client'

import { Badge } from '@/components/ui/badge'
import {
  TreeTable,
  type TreeTableColumn,
  type TreeTableItem,
} from '@/components/tree-table'
import { cn } from '@/lib/utils'
import { featuredTypes, statusTypes, syncTypes } from '../constants'
import type { Category } from '../types'

export interface CategoryTreeItem extends TreeTableItem {
  id: string
  name: string
  children?: CategoryTreeItem[]
  active_status?: string
  featured_status?: string
  sync_status?: string
}

function categoryToTreeItem(c: Category): CategoryTreeItem {
  return {
    id: String(c.id),
    name: c.name,
    active_status: c.active_status,
    featured_status: c.featured_status,
    sync_status: c.sync_status,
    children: c.children?.length
      ? c.children.map(categoryToTreeItem)
      : undefined,
  }
}

const statusBadge = (
  status: string | undefined,
  typeMap: Map<string, string>
) => {
  const badgeClass = status ? typeMap.get(status) : undefined
  return (
    <Badge variant="outline" className={cn('capitalize text-xs', badgeClass)}>
      {status ?? '—'}
    </Badge>
  )
}

const CATEGORY_COLUMNS: TreeTableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    widthIndex: 0,
    isFirst: true,
    render: (item: TreeTableItem, _level: number, isSelected: boolean) => (
      <span
        className={
          isSelected ? 'font-semibold text-neutral-50' : 'text-neutral-200'
        }
      >
        {item.name}
      </span>
    ),
  },
  {
    key: 'id',
    label: 'ID',
    widthIndex: 1,
    render: (item: TreeTableItem) => (
      <span className="font-mono text-xs text-neutral-400">{item.id}</span>
    ),
  },
  {
    key: 'active_status',
    label: 'Active',
    widthIndex: 2,
    render: (item: TreeTableItem) =>
      statusBadge((item as CategoryTreeItem).active_status, statusTypes),
  },
  {
    key: 'featured_status',
    label: 'Featured',
    widthIndex: 3,
    render: (item: TreeTableItem) =>
      statusBadge((item as CategoryTreeItem).featured_status, featuredTypes),
  },
  {
    key: 'sync_status',
    label: 'Sync',
    widthIndex: 4,
    render: (item: TreeTableItem) =>
      statusBadge((item as CategoryTreeItem).sync_status, syncTypes),
  },
]

const CATEGORY_COLUMN_WIDTHS = [180, 60, 90, 90, 90]

type CategoryChildrenTreeProps = {
  children?: Category[]
  className?: string
}

export function CategoryChildrenTree({
  children: categoryChildren = [],
  className,
}: CategoryChildrenTreeProps) {
  const treeData = categoryChildren.map(categoryToTreeItem)

  if (treeData.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-sm font-medium text-muted-foreground">
        Child Categories
      </div>
      <TreeTable
        data={treeData}
        columns={CATEGORY_COLUMNS}
        columnWidths={CATEGORY_COLUMN_WIDTHS}
        compact
      />
    </div>
  )
}
