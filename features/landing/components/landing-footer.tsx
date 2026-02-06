'use client'

import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '#' },
    { name: 'Best Sellers', href: '#' },
    { name: 'New Arrivals', href: '#' },
    { name: 'Sale Items', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'FAQ', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Track Order', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Settings', href: '#' },
    { name: 'Accessibility', href: '#' },
  ],
}

const socialLinks = [
  { icon: Facebook, name: 'Facebook', href: '#' },
  { icon: Twitter, name: 'Twitter', href: '#' },
  { icon: Instagram, name: 'Instagram', href: '#' },
  { icon: Linkedin, name: 'LinkedIn', href: '#' },
]

export function LandingFooter() {
  return (
    <footer className='w-full border-t border-border bg-background'>
      <div className='container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
        {/* Main Footer Content */}
        <div className='mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5'>
          {/* Brand Section */}
          <div className='sm:col-span-1 lg:col-span-1'>
            <h3 className='mb-4 font-semibold text-foreground'>EcomStore</h3>
            <p className='text-sm text-muted-foreground'>
              Premium products delivered with exceptional service.
            </p>
            <div className='mt-4 flex gap-4'>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className='text-muted-foreground transition-colors hover:text-foreground'
                  >
                    <Icon className='size-5' />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className='mb-4 font-semibold text-foreground'>Shop</h3>
            <ul className='space-y-2'>
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='mb-4 font-semibold text-foreground'>Company</h3>
            <ul className='space-y-2'>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='mb-4 font-semibold text-foreground'>Support</h3>
            <ul className='space-y-2'>
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className='mb-4 font-semibold text-foreground'>Legal</h3>
            <ul className='space-y-2'>
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='mb-8 h-px bg-border' />

        {/* Bottom Section */}
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <p className='text-sm text-muted-foreground'>
            © 2024 EcomStore. All rights reserved.
          </p>
          <p className='text-sm text-muted-foreground'>
            Made with ❤️ for our amazing customers
          </p>
        </div>
      </div>
    </footer>
  )
}
