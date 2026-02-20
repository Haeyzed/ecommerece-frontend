import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { DepartmentsClient } from "@/features/hrm/departments";
import { hasPermission } from "@/lib/utils/permissions"

export const metadata = {
  title: "Departments Management",
}

export default async function DepartmentsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view departments")
  if (!canView) {
    return (
      <ForbiddenError />
    )
  }
  return <DepartmentsClient />
}