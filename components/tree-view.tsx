'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/* Context                                  */
/* -------------------------------------------------------------------------- */

type TreeContextProps = {
  selectedId: string | undefined
  onSelect: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  setDraggedItem: (item: TreeDataItem | null) => void
  onDrop: (target: TreeDataItem) => void
}

const TreeContext = React.createContext<TreeContextProps | null>(null)

function useTree() {
  const context = React.useContext(TreeContext)
  if (!context) throw new Error('useTree must be used within a TreeView')
  return context
}

/* -------------------------------------------------------------------------- */
/* Variants                                 */
/* -------------------------------------------------------------------------- */

const treeItemVariants = cva(
  'group relative flex items-center rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
  {
    variants: {
      isDragOver: {
        true: 'bg-primary/10 ring-2 ring-primary ring-inset',
      },
    },
    defaultVariants: {
      isDragOver: false,
    },
  }
)

/* -------------------------------------------------------------------------- */
/* Types                                   */
/* -------------------------------------------------------------------------- */

export interface TreeDataItem {
  id: string
  name: string
  icon?: LucideIcon
  iconUrl?: string | null
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
  className?: string
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[]
  initialSelectedId?: string
  onSelectChange?: (item: TreeDataItem) => void
  onDragAndDrop?: (source: TreeDataItem, target: TreeDataItem) => void
  expandAll?: boolean
}

/* -------------------------------------------------------------------------- */
/* Components                                 */
/* -------------------------------------------------------------------------- */

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ data, initialSelectedId, onSelectChange, onDragAndDrop, expandAll, className, ...props }, ref) => {
    const [selectedId, setSelectedId] = React.useState(initialSelectedId)
    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

    const handleSelect = React.useCallback((item: TreeDataItem) => {
      setSelectedId(item.id)
      onSelectChange?.(item)
    }, [onSelectChange])

    const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
      if (draggedItem && draggedItem.id !== targetItem.id) {
        onDragAndDrop?.(draggedItem, targetItem)
      }
      setDraggedItem(null)
    }, [draggedItem, onDragAndDrop])

    // Generate initial expanded items if expandAll or initialSelectedId is provided
    const defaultExpanded = React.useMemo(() => {
      if (expandAll) {
        const getAllIds = (items: TreeDataItem[]): string[] => 
          items.reduce((acc, item) => [...acc, item.id, ...(item.children ? getAllIds(item.children) : [])], [] as string[])
        return getAllIds(data)
      }
      return initialSelectedId ? [initialSelectedId] : []
    }, [data, expandAll, initialSelectedId])

    return (
      <TreeContext.Provider value={{ selectedId, onSelect: handleSelect, draggedItem, setDraggedItem, onDrop: handleDrop }}>
        <div ref={ref} className={cn('space-y-1', className)} {...props}>
          <AccordionPrimitive.Root type="multiple" defaultValue={defaultExpanded} className="w-full">
            {data.map((item) => (
              <RecursiveTreeItem key={item.id} item={item} />
            ))}
          </AccordionPrimitive.Root>
        </div>
      </TreeContext.Provider>
    )
  }
)
TreeView.displayName = 'TreeView'

const RecursiveTreeItem = ({ item }: { item: TreeDataItem }) => {
  const { selectedId, onSelect, setDraggedItem, onDrop, draggedItem } = useTree()
  const [isDragOver, setIsDragOver] = React.useState(false)

  const hasChildren = item.children && item.children.length > 0
  const isSelected = selectedId === item.id

  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable || item.disabled) return e.preventDefault()
    setDraggedItem(item)
  }

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem?.id !== item.id) {
      e.preventDefault()
      setIsDragOver(true)
    }
  }

  const handleItemDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(item)
  }

  const commonProps = {
    draggable: item.draggable,
    onDragStart,
    onDragOver,
    onDragLeave: () => setIsDragOver(false),
    onDrop: handleItemDrop,
    'data-selected': isSelected,
    className: cn(treeItemVariants({ isDragOver }), item.className),
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      if (item.disabled) return
      onSelect(item)
      item.onClick?.()
    }
  }

  if (hasChildren) {
    return (
      <AccordionPrimitive.Item value={item.id} className="border-none">
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger asChild>
            <div {...commonProps} className={cn(commonProps.className, "cursor-pointer")}>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <TreeIcon item={item} className="ml-1" />
              <span className="flex-1 truncate">{item.name}</span>
              {item.actions && <div className="ml-2 opacity-0 group-hover:opacity-100">{item.actions}</div>}
            </div>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="ml-4 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="mt-1 border-l pl-2 space-y-1">
            {item.children?.map((child) => (
              <RecursiveTreeItem key={child.id} item={child} />
            ))}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }

  return (
    <div {...commonProps} className={cn(commonProps.className, "ml-4 cursor-pointer")}>
      <TreeIcon item={item} />
      <span className="flex-1 truncate">{item.name}</span>
      {item.actions && <div className="ml-2 opacity-0 group-hover:opacity-100">{item.actions}</div>}
    </div>
  )
}

const TreeIcon = ({ item, className }: { item: TreeDataItem; className?: string }) => {
  if (item.iconUrl) {
    return <img src={item.iconUrl} alt="" className={cn('h-4 w-4 shrink-0 mr-2 object-contain', className)} />
  }
  if (item.icon) {
    const Icon = item.icon
    return <Icon className={cn('h-4 w-4 shrink-0 mr-2 text-muted-foreground', className)} />
  }
  return null
}

export { TreeView }