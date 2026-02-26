import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { RolesClient } from "@/features/settings/acl/roles";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles | System Settings",
  description:
    "Create and manage user roles, assign permissions, and control access levels across the app system from the settings panel.",
};

export default async function RolesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view roles")

  if (!canView) {
    return <ForbiddenError />
  }

  return <RolesClient />
}