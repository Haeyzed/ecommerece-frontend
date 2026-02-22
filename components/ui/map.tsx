'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const LazyMap = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />
})

export function Map(props: { lat: number, lng: number, zoom?: number }) {
  return <LazyMap {...props} />
}