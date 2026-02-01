'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  ArrowRight02Icon,
  LaptopIcon,
  Moon02Icon,
  Sun03Icon
} from '@hugeicons/core-free-icons'
import { useSearch } from '@/lib/providers/search-provider'
import { useTheme } from '@/lib/providers/theme-provider'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <ScrollArea type='hover' className='h-72 pe-1'>
            <CommandEmpty>No results found.</CommandEmpty>
            {sidebarData.navGroups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((navItem, i) => {
                  // Top level items
                  if (navItem.url)
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.url as string))
                        }}
                      >
                        <div className='flex size-4 items-center justify-center'>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            className='size-2 text-muted-foreground/80'
                            strokeWidth={2}
                          />
                        </div>
                        {navItem.title}
                      </CommandItem>
                    )

                  // Nested items
                  return navItem.items?.map((subItem, i) => (
                    <CommandItem
                      key={`${navItem.title}-${subItem.url}-${i}`}
                      value={`${navItem.title}-${subItem.url}`}
                      onSelect={() => {
                        runCommand(() => router.push(subItem.url))
                      }}
                    >
                      <div className='flex size-4 items-center justify-center'>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className='size-2 text-muted-foreground/80'
                          strokeWidth={2}
                        />
                      </div>
                      {navItem.title}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        className='size-4 text-muted-foreground'
                        strokeWidth={2}
                      />
                      {subItem.title}
                    </CommandItem>
                  ))
                })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading='Theme'>
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                <HugeiconsIcon icon={Sun03Icon} strokeWidth={2} className="mr-2 size-4" />
                <span>Light</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} className="mr-2 size-4 scale-90" />
                <span>Dark</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                <HugeiconsIcon icon={LaptopIcon} strokeWidth={2} className="mr-2 size-4" />
                <span>System</span>
              </CommandItem>
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}