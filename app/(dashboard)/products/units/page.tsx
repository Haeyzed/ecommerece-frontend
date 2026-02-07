import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { UnitsClient } from "@/features/products/units";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Units Management",
}

export default async function UnitsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "units-index")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <UnitsClient />
}