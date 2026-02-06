'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className='relative w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-12 sm:py-20 lg:py-28'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-center text-center'>
          {/* Badge */}
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2'>
            <span className='text-xs font-medium text-foreground sm:text-sm'>
              🎉 Welcome to Our Store
            </span>
          </div>

          {/* Main Headline */}
          <h1 className='mb-6 max-w-4xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl'>
            Discover Premium Products at Unbeatable Prices
          </h1>

          {/* Subheadline */}
          <p className='mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl'>
            Shop from our curated collection of high-quality products. Fast shipping, secure checkout, and 24/7 customer support.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button size='lg' className='gap-2'>
              Shop Now
              <ArrowRight className='size-4' />
            </Button>
            <Button size='lg' variant='outline'>
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className='mt-12 grid grid-cols-3 gap-4 sm:gap-8'>
            <div className='flex flex-col items-center gap-2'>
              <div className='text-2xl font-bold text-primary sm:text-3xl'>10K+</div>
              <p className='text-xs text-muted-foreground sm:text-sm'>Happy Customers</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='text-2xl font-bold text-primary sm:text-3xl'>500+</div>
              <p className='text-xs text-muted-foreground sm:text-sm'>Products</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='text-2xl font-bold text-primary sm:text-3xl'>24/7</div>
              <p className='text-xs text-muted-foreground sm:text-sm'>Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
