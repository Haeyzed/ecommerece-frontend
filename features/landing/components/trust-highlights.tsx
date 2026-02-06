'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Truck, Shield, HeartHandshake, Clock } from 'lucide-react'

const highlights = [
  {
    id: 1,
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50. Fast delivery to your doorstep.',
  },
  {
    id: 2,
    icon: Shield,
    title: 'Secure Payment',
    description: 'Your payment information is always safe with us.',
  },
  {
    id: 3,
    icon: HeartHandshake,
    title: 'Easy Returns',
    description: '30-day money-back guarantee. No questions asked.',
  },
  {
    id: 4,
    icon: Clock,
    title: '24/7 Support',
    description: 'Our customer service team is always here to help.',
  },
]

export function TrustHighlights() {
  return (
    <section className='w-full bg-background py-12 sm:py-16 lg:py-20'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {highlights.map((highlight) => {
            const Icon = highlight.icon
            return (
              <Card
                key={highlight.id}
                className='border-border/50 bg-card shadow-none transition-all duration-300 hover:border-border'
              >
                <CardContent className='flex flex-col items-start gap-4 p-6'>
                  <div className='rounded-lg bg-primary/10 p-3'>
                    <Icon className='size-6 text-primary' />
                  </div>
                  <div>
                    <h3 className='mb-2 font-semibold text-foreground'>
                      {highlight.title}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {highlight.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
