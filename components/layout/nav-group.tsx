'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronRight } from '@hugeicons/core-free-icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'
import { useAuthSession } from '@/features/auth/api'
import { hasPermission } from '@/lib/utils/permissions'

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions

  // Filter items based on permissions
  const visibleItems = items.filter((item) => {
    // 1. Check item's own permissions
    if (!hasPermission(userPermissions, item.permissions)) {
      return false
    }

    // 2. If it's a collapsible group, check if it has any visible children
    if (item.items) {
      const visibleChildren = item.items.filter(child => 
        hasPermission(userPermissions, child.permissions)
      )
      // Only show group if it has visible children
      return visibleChildren.length > 0
    }

    return true
  })

  // If no items are visible in this group, don't render the group header
  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const key = `${item.title}-${item.url}`

          // For collapsible items, we need to filter their children inside the map too
          // to ensure restricted children don't show up in the dropdown
          if (item.items) {
             const filteredChildren = item.items.filter(child => 
                hasPermission(userPermissions, child.permissions)
             )
             // Create a new item object with filtered children to pass down
             const itemWithFilteredChildren = { ...item, items: filteredChildren }

             if (state === 'collapsed' && !isMobile)
               return (
                 <SidebarMenuCollapsedDropdown key={key} item={itemWithFilteredChildren} pathname={pathname} />
               )
             return <SidebarMenuCollapsible key={key} item={itemWithFilteredChildren} pathname={pathname} />
          }

          return <SidebarMenuLink key={key} item={item} pathname={pathname} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({ item, pathname }: { item: NavLink; pathname: string }) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(pathname, item)}
        tooltip={item.title}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(pathname, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <HugeiconsIcon 
              icon={ChevronRight} 
              strokeWidth={2}
              className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' 
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(pathname, subItem)}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(pathname, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <HugeiconsIcon 
              icon={ChevronRight} 
              strokeWidth={2}
              className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' 
            />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={`${checkIsActive(pathname, sub) ? 'bg-secondary' : ''}`}
              >
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && (
                  <span className='ms-auto text-xs'>{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  return (
    pathname === item.url || // /endpint?search=param
    pathname.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === pathname).length || // if child nav is active
    (mainNav &&
      pathname.split('/')[1] !== '' &&
      pathname.split('/')[1] === item?.url?.split('/')[1])
  )
}