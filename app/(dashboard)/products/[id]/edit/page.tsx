"use client";

/**
 * Edit Product Page
 */

import { ProductForm } from "@/features/products/components/product-form";
import { useProduct, useUpdateProduct } from "@/features/products/api";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: product, isLoading, isSessionLoading } = useProduct(id);
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (data: Parameters<typeof updateMutation.mutateAsync>[0]["data"]) => {
    await updateMutation.mutateAsync({ id, data });
    router.push("/products");
  };

  if (isSessionLoading || isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
