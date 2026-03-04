'use client'

/**
 * Edit Product Page
 */
import { useParams, useRouter } from 'next/navigation'

import { useProduct, useUpdateProduct } from '@/features/products/api'
import { ProductForm } from '@/features/products/components/product-form'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { data: product, isLoading, isSessionLoading } = useProduct(id)
  const updateMutation = useUpdateProduct()

  const handleSubmit = async (
    data: Parameters<typeof updateMutation.mutateAsync>[0]['data']
  ) => {
    await updateMutation.mutateAsync({ id, data })
    router.push('/products')
  }

  if (isSessionLoading || isLoading) {
    return <div className='container mx-auto py-8'>Loading...</div>
  }

  if (!product) {
    return <div className='container mx-auto py-8'>Product not found</div>
  }

  return (
    <div className='container mx-auto max-w-2xl py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Edit Product</h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}
