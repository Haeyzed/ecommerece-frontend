import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcomStore - Premium Products at Unbeatable Prices',
  description:
    'Shop from our curated collection of high-quality products. Fast shipping, secure checkout, and 24/7 customer support.',
  keywords: [
    'ecommerce',
    'shopping',
    'products',
    'electronics',
    'fashion',
    'accessories',
  ],
  openGraph: {
    title: 'EcomStore - Shop Premium Products',
    description:
      'Discover high-quality products with fast shipping and excellent customer service.',
    type: 'website',
  },
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
