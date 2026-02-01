/**
 * Products List Page
 * Example feature-based CRUD page
 */

import { ProductList } from "@/features/products/components/product-list";

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <ProductList />
    </div>
  );
}
