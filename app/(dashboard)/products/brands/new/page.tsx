"use client";

/**
 * Create Brand Page
 */

import { BrandForm } from "@/features/brands/components/brand-form";
import { useCreateBrand } from "@/features/products/brands/api";
import { useRouter } from "next/navigation";

export default function NewBrandPage() {
  const router = useRouter();
  const createMutation = useCreateBrand();

  const handleSubmit = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(data);
    router.push("/brands");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Brand</h1>
      <BrandForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
