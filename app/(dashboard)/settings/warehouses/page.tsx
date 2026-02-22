import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { WarehousesClient } from "@/features/settings/warehouses";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Warehouses Management",
}

export default async function WarehousesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view warehouses")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <WarehousesClient />
}