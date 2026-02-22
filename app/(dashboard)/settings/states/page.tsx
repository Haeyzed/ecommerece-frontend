import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { StatesClient } from "@/features/settings/states";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "States Management",
}

export default async function StatesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view states")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <StatesClient />
}