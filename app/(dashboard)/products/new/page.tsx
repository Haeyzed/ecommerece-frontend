'use client'

/**
 * Create Product Page
 */
import { useRouter } from 'next/navigation'

import { useCreateProduct } from '@/features/products/api'
import { ProductForm } from '@/features/products/components/product-form'

export default function NewProductPage() {
  const router = useRouter()
  const createMutation = useCreateProduct()

  const handleSubmit = async (
    data: Parameters<typeof createMutation.mutateAsync>[0]
  ) => {
    await createMutation.mutateAsync(data)
    router.push('/products')
  }

  return (
    <div className='container mx-auto max-w-2xl py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Create Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
