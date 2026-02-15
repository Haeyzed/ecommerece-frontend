'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const treeVariants = cva(
  'group relative flex items-center px-2 py-2 before:absolute before:left-0 before:h-8 before:w-full before:-z-10 before:rounded-lg before:bg-accent/70 before:opacity-0 hover:before:opacity-100'
)

const selectedTreeVariants = cva('before:opacity-100 before:bg-accent/70 text-accent-foreground')

const dragOverVariants = cva('before:opacity-100 before:bg-primary/20 text-primary-foreground')

export interface TreeDataItem {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  iconUrl?: string | null
  selectedIcon?: React.ComponentType<{ className?: string }>
  openIcon?: React.ComponentType<{ className?: string }>
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
  className?: string
}

export type TreeRenderItemParams = {
  item: TreeDataItem
  level: number
  isLeaf: boolean
  isSelected: boolean
  isOpen?: boolean
  hasChildren: boolean
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[] | TreeDataItem
  initialSelectedItemId?: string
  onSelectChange?: (item: TreeDataItem | undefined) => void
  expandAll?: boolean
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  enableDragHandle?: boolean
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      onDocumentDrag,
      renderItem,
      enableDragHandle = false,
      ...props
    },
    ref
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(
      initialSelectedItemId
    )
    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id)
        onSelectChange?.(item)
      },
      [onSelectChange]
    )

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item)
    }, [])

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem) => {
        if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
          onDocumentDrag(draggedItem, targetItem)
        }
        setDraggedItem(null)
      },
      [draggedItem, onDocumentDrag]
    )

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[]
      }

      const ids: string[] = []

      function walkTreeItems(items: TreeDataItem[] | TreeDataItem, targetId: string): boolean {
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i].id)
            if (walkTreeItems(items[i], targetId) && !expandAll) {
              return true
            }
            if (!expandAll) ids.pop()
          }
          return false
        } else if (!expandAll && items.id === targetId) {
          return true
        } else if (items.children) {
          return walkTreeItems(items.children, targetId)
        }
        return false
      }

      walkTreeItems(data, initialSelectedItemId)
      return ids
    }, [data, expandAll, initialSelectedItemId])

    return (
      <div className={cn('relative overflow-hidden p-2', className)} ref={ref} {...props}>
        <TreeItem
          data={data}
          selectedItemId={selectedItemId}
          handleSelectChange={handleSelectChange}
          expandedItemIds={expandedItemIds}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeIcon={defaultNodeIcon}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          draggedItem={draggedItem}
          renderItem={renderItem}
          level={0}
          enableDragHandle={enableDragHandle}
        />
        <div
          className="h-12 w-full"
          onDrop={(e) => {
            e.preventDefault()
            handleDrop({ id: '', name: 'root' })
          }}
          onDragOver={(e) => e.preventDefault()}
        />
      </div>
    )
  }
)
TreeView.displayName = 'TreeView'

interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[] | TreeDataItem
  selectedItemId?: string
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  level?: number
  enableDragHandle?: boolean
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      renderItem,
      level = 0,
      enableDragHandle,
      ...props
    },
    ref
  ) => {
    const items = Array.isArray(data) ? data : [data]

    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <TreeNode
                  item={item}
                  level={level}
                  selectedItemId={selectedItemId}
                  expandedItemIds={expandedItemIds}
                  handleSelectChange={handleSelectChange}
                  defaultNodeIcon={defaultNodeIcon}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                  renderItem={renderItem}
                  enableDragHandle={enableDragHandle}
                />
              ) : (
                <TreeLeaf
                  item={item}
                  level={level}
                  selectedItemId={selectedItemId}
                  handleSelectChange={handleSelectChange}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                  renderItem={renderItem}
                  enableDragHandle={enableDragHandle}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
)
TreeItem.displayName = 'TreeItem'

interface TreeNodeProps {
  item: TreeDataItem
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  selectedItemId?: string
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  level?: number
  enableDragHandle?: boolean
}

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  handleDragStart,
  handleDrop,
  draggedItem,
  renderItem,
  level = 0,
  enableDragHandle,
}) => {
  const [value, setValue] = React.useState<string[]>(
    expandedItemIds.includes(item.id) ? [item.id] : []
  )
  const [isDragOver, setIsDragOver] = React.useState(false)
  const hasChildren = !!item.children?.length
  const isSelected = selectedItemId === item.id
  const isOpen = value.includes(item.id)

  const onDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (!item.draggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', item.id)
    handleDragStart?.(item)
  }

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
    }
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    handleDrop?.(item)
  }

  return (
    <AccordionPrimitive.Root type="multiple" value={value} onValueChange={setValue}>
      <AccordionPrimitive.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            treeVariants(),
            isSelected && selectedTreeVariants(),
            isDragOver && dragOverVariants(),
            item.className
          )}
          onClick={() => {
            handleSelectChange(item)
            item.onClick?.()
          }}
          draggable={!!item.draggable}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {renderItem ? (
            renderItem({
              item,
              level,
              isLeaf: false,
              isSelected,
              isOpen,
              hasChildren,
            })
          ) : (
            <>
              <TreeIcon
                item={item}
                isSelected={isSelected}
                isOpen={isOpen}
                default={defaultNodeIcon}
              />
              <span className="truncate text-sm">{item.name}</span>
              <TreeActions isSelected={isSelected}>{item.actions}</TreeActions>
            </>
          )}
        </AccordionTrigger>
        <AccordionContent className="border-l border-border pl-1">
          <TreeItem
            data={item.children || item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            draggedItem={draggedItem}
            renderItem={renderItem}
            level={level + 1}
            enableDragHandle={enableDragHandle}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

interface TreeLeafProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TreeDataItem
  level: number
  selectedItemId?: string
  handleSelectChange: (item: TreeDataItem | undefined) => void
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  enableDragHandle?: boolean
}

const TreeLeaf = React.forwardRef<HTMLDivElement, TreeLeafProps>(
  (
    {
      className,
      item,
      level,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      renderItem,
      enableDragHandle,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const isSelected = selectedItemId === item.id
    const isDisabled = item.disabled

    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (!item.draggable || isDisabled) {
        e.preventDefault()
        return
      }
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', item.id)
      handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      if (item.droppable !== false && !isDisabled && draggedItem && draggedItem.id !== item.id) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
      }
    }

    const onDragLeave = () => {
      setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (isDisabled) return
      e.preventDefault()
      setIsDragOver(false)
      handleDrop?.(item)
    }

    const handleClick = () => {
      if (isDisabled) return
      handleSelectChange(item)
      item.onClick?.()
    }

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex cursor-pointer items-center py-2 pl-5 text-left before:absolute before:left-0 before:-z-10 before:h-8 before:w-full before:rounded-lg before:bg-accent/70 before:opacity-0 hover:before:opacity-100',
          treeVariants(),
          isSelected && selectedTreeVariants(),
          isDragOver && dragOverVariants(),
          isDisabled && 'cursor-not-allowed opacity-50 pointer-events-none',
          className,
          item.className
        )}
        onClick={handleClick}
        draggable={!!item.draggable && !isDisabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
      >
        {renderItem ? (
          <>
            <div className="mr-1 h-4 w-4 shrink-0" />
            {renderItem({
              item,
              level,
              isLeaf: true,
              isSelected,
              hasChildren: false,
            })}
          </>
        ) : (
          <>
            <TreeIcon item={item} isSelected={isSelected} default={defaultLeafIcon} />
            <span className="flex-grow truncate text-sm">{item.name}</span>
            <TreeActions isSelected={isSelected && !isDisabled}>{item.actions}</TreeActions>
          </>
        )}
      </div>
    )
  }
)
TreeLeaf.displayName = 'TreeLeaf'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full flex-1 items-center py-2 transition-all [&[data-state=open]>svg:first-child]:rotate-90',
        className
      )}
      {...props}
    >
      <ChevronRight className="mr-1 h-4 w-4 shrink-0 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-1">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = 'AccordionContent'

interface TreeIconProps {
  item: TreeDataItem
  isOpen?: boolean
  isSelected?: boolean
  default?: React.ComponentType<{ className?: string }>
}

const TreeIcon: React.FC<TreeIconProps> = ({ item, isOpen, isSelected, default: defaultIcon }) => {
  if (item.iconUrl) {
    return <img src={item.iconUrl} alt="" className="mr-2 h-4 w-4 shrink-0 object-contain" />
  }

  let Icon: React.ComponentType<{ className?: string }> | undefined = defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }

  if (!Icon) {
    return null
  }

  return <Icon className="mr-2 h-4 w-4 shrink-0" />
}

interface TreeActionsProps {
  children: React.ReactNode
  isSelected: boolean
}

const TreeActions: React.FC<TreeActionsProps> = ({ children, isSelected }) => {
  return (
    <div className={cn('absolute right-2 group-hover:block', isSelected ? 'block' : 'hidden')}>
      {children}
    </div>
  )
}

export {
  TreeView,
  TreeItem,
  TreeNode,
  TreeLeaf,
  AccordionTrigger,
  AccordionContent,
}
