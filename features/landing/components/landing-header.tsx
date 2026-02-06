'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Menu, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { name: 'Shop', href: '#' },
  { name: 'Categories', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
]

export function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className='sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between gap-4 sm:h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 font-bold text-foreground'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold'>
              E
            </div>
            <span className='hidden sm:inline'>EcomStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Cart Icon */}
            <Button
              variant='ghost'
              size='icon'
              className='relative'
              aria-label='Shopping cart'
            >
              <ShoppingCart className='size-5' />
              <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
                0
              </span>
            </Button>

            {/* Login Button */}
            <Button
              variant='ghost'
              size='icon'
              className='hidden sm:flex'
              aria-label='User account'
            >
              <User className='size-5' />
            </Button>

            {/* Mobile Menu */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden'
                  aria-label='Open menu'
                >
                  <Menu className='size-5' />
                </Button>
              </DrawerTrigger>
              <DrawerContent className='h-auto'>
                <nav className='flex flex-col gap-4 p-4'>
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className='text-base font-medium transition-colors hover:text-primary'
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  <Button variant='default' className='mt-4 w-full'>
                    Sign In
                  </Button>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}
