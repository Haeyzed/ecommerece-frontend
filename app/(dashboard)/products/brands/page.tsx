import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { BrandsClient } from "@/features/products/brands";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Brands Management",
}

export default async function BrandsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "brands-index")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <BrandsClient />
}