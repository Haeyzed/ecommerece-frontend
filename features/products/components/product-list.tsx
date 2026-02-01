"use client";

/**
 * Product List Component
 * Example CRUD list with pagination
 */

import { useProducts, useDeleteProduct } from "../api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

export function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isSessionLoading } = useProducts({ page, per_page: 10 });
  const deleteMutation = useDeleteProduct();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete");
      }
    }
  };

  if (isSessionLoading || isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link href="/dashboard/products/new">
          <Button>Create Product</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No products found. Create your first product to get started.
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>Price: ${product.price}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
