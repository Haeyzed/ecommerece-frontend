'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Shirt, Watch, Zap } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Electronics',
    icon: Zap,
    description: 'Latest gadgets and devices',
    href: '#',
  },
  {
    id: 2,
    name: 'Fashion',
    icon: Shirt,
    description: 'Trending styles & collections',
    href: '#',
  },
  {
    id: 3,
    name: 'Accessories',
    icon: Watch,
    description: 'Premium accessories',
    href: '#',
  },
  {
    id: 4,
    name: 'All Products',
    icon: ShoppingBag,
    description: 'Browse all items',
    href: '#',
  },
]

export function FeaturedCategories() {
  return (
    <section className='w-full bg-background py-12 sm:py-16 lg:py-20'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl'>
            Shop by Category
          </h2>
          <p className='text-base text-muted-foreground sm:text-lg'>
            Explore our wide range of products across different categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className='group relative overflow-hidden transition-all duration-300 hover:shadow-md'
              >
                <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
                  <div className='rounded-full bg-primary/10 p-4 transition-transform duration-300 group-hover:scale-110'>
                    <Icon className='size-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold text-foreground'>
                      {category.name}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {category.description}
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    asChild
                    className='w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                  >
                    <a href={category.href}>Explore</a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
