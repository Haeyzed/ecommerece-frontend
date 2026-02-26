import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { EmployeesClient } from "@/features/hrm/employees";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | HR Management System",
  description:
    "Manage company employees, organize teams, and control employees structure within the HR management system.",
};

export default async function DesignationsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view employees")

  if (!canView) {
    return <ForbiddenError />
  }

  return <EmployeesClient />
}