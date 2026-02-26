import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { PermissionsClient } from "@/features/settings/acl/permissions";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions | System Settings",
  description:
    "Configure and manage system permissions to control user access, actions, and authorization roles within the system settings.",
};

export default async function PermissionsPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view permissions")

  if (!canView) {
    return <ForbiddenError />
  }

  return <PermissionsClient />
}