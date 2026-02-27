import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { OvertimesClient } from "@/features/hrm/overtimes";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overtime Types | HR Management System",
  description:
    "Manage company overtimes, organize teams, and control overtimes structure within the HR management system.",
};

export default async function OvertimesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view overtimes")

  if (!canView) {
    return <ForbiddenError />
  }

  return <OvertimesClient />
}