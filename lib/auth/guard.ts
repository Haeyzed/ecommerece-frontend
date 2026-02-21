import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/utils/permissions";

export async function requirePermission(permission: string | string[]) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userPermissions = session.user.user_permissions;

  if (!hasPermission(userPermissions, permission)) {
    redirect("/forbidden");
  }
}