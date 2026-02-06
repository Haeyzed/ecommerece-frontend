'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviews: 124,
    badge: 'Sale',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  },
  {
    id: 2,
    name: 'Stylish Smart Watch',
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviews: 89,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
  },
  {
    id: 3,
    name: 'Designer Sunglasses',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 156,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
  },
  {
    id: 4,
    name: 'Professional Camera',
    price: 599.99,
    originalPrice: 799.99,
    rating: 4.9,
    reviews: 203,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=500&h=500&fit=crop',
  },
]

export function FeaturedProducts() {
  return (
    <section className='w-full bg-muted/30 py-12 sm:py-16 lg:py-20'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='mb-12 flex items-center justify-between'>
          <div>
            <h2 className='mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl'>
              Featured Products
            </h2>
            <p className='text-base text-muted-foreground sm:text-lg'>
              Check out our best-selling and newest items
            </p>
          </div>
          <Button variant='outline' className='hidden sm:flex'>
            View All Products
          </Button>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {products.map((product) => (
            <Card
              key={product.id}
              className='group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg'
            >
              {/* Product Image */}
              <div className='relative aspect-square w-full overflow-hidden bg-muted'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                  loading='lazy'
                />
                {product.badge && (
                  <Badge className='absolute right-3 top-3 bg-primary text-primary-foreground'>
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Product Details */}
              <CardHeader className='flex-1'>
                <CardTitle className='line-clamp-2 text-base'>
                  {product.name}
                </CardTitle>
                <div className='flex items-center gap-1'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    ({product.reviews})
                  </span>
                </div>
              </CardHeader>

              {/* Pricing */}
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-lg font-bold text-primary'>
                    ${product.price}
                  </span>
                  <span className='text-sm text-muted-foreground line-through'>
                    ${product.originalPrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size='sm'
                  className='w-full gap-2'
                  variant='default'
                >
                  <ShoppingCart className='size-4' />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className='mt-8 flex sm:hidden'>
          <Button variant='outline' className='w-full'>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
