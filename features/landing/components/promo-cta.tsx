'use client'

import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export function PromoCTA() {
  return (
    <section className='relative w-full overflow-hidden bg-gradient-to-r from-primary to-primary/80 py-12 sm:py-16 lg:py-20'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-center gap-6 text-center'>
          {/* Icon */}
          <div className='rounded-full bg-primary-foreground/20 p-4'>
            <Zap className='size-8 text-primary-foreground' />
          </div>

          {/* Content */}
          <div className='max-w-2xl'>
            <h2 className='mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl'>
              Limited Time Offer
            </h2>
            <p className='mb-8 text-base text-primary-foreground/90 sm:text-lg'>
              Get up to 50% off on selected items. Use code WELCOME50 at checkout.
              Offer valid until the end of this month.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button
              size='lg'
              className='bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2'
            >
              Shop the Sale
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'
            >
              See Terms
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className='absolute right-0 top-1/2 -translate-y-1/2 opacity-10'>
        <div className='size-96 rounded-full bg-primary-foreground' />
      </div>
    </section>
  )
}
