import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { BillersClient } from "@/features/people/billers";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Billers Management",
}

export default async function BillersPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view billers")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <BillersClient />
}