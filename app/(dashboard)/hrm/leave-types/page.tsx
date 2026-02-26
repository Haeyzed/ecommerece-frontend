import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { LeaveTypesClient } from "@/features/hrm/leave-types";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Types | HR Management System",
  description:
    "Manage company leave types, organize teams, and control leave types structure within the HR management system.",
};

export default async function LeaveTypesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view leave types")

  if (!canView) {
    return <ForbiddenError />
  }

  return <LeaveTypesClient />
}