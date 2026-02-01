"use client";

/**
 * Edit Brand Page
 */

import { BrandForm } from "@/features/brands/components/brand-form";
import { useBrand, useUpdateBrand } from "@/features/products/brands/api";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: brand, isLoading, isSessionLoading } = useBrand(id);
  const updateMutation = useUpdateBrand();

  const handleSubmit = async (data: Parameters<typeof updateMutation.mutateAsync>[0]["data"]) => {
    await updateMutation.mutateAsync({ id, data });
    router.push("/brands");
  };

  if (isSessionLoading || isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!brand) {
    return <div className="container mx-auto py-8">Brand not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Brand</h1>
      <BrandForm
        brand={brand}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
