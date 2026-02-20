import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { HolidaysClient } from "@/features/hrm/holidays";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Holidays Management",
}

export default async function HolidaysPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view holidays")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <HolidaysClient />
}