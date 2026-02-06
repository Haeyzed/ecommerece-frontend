import type { Metadata } from 'next'
import {
  LandingHeader,
  Hero,
  TrustHighlights,
  FeaturedCategories,
  FeaturedProducts,
  PromoCTA,
  Newsletter,
  LandingFooter,
} from '@/features/landing/components'

export const metadata: Metadata = {
  title: 'EcomStore - Premium Products at Unbeatable Prices',
  description:
    'Shop from our curated collection of high-quality products. Fast shipping, secure checkout, and 24/7 customer support.',
}

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col'>
      <LandingHeader />
      <main className='flex-1'>
        <Hero />
        <TrustHighlights />
        <FeaturedCategories />
        <FeaturedProducts />
        <PromoCTA />
        <Newsletter />
      </main>
      <LandingFooter />
    </div>
  )
}
