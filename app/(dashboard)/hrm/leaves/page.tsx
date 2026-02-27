import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { LeavesClient } from "@/features/hrm/leaves";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Types | HR Management System",
  description:
    "Manage company leaves, organize teams, and control leaves structure within the HR management system.",
};

export default async function LeavesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view leaves")

  if (!canView) {
    return <ForbiddenError />
  }

  return <LeavesClient />
}