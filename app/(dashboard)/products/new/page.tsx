"use client";

/**
 * Create Product Page
 */

import { ProductForm } from "@/features/products/components/product-form";
import { useCreateProduct } from "@/features/products/api";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();

  const handleSubmit = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(data);
    router.push("/products");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
