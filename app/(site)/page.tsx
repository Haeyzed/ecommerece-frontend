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
