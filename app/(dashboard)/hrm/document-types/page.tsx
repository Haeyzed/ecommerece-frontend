import { auth } from "@/auth"
import { ForbiddenError } from "@/features/errors/forbidden";
import { DocumentTypesClient } from "@/features/hrm/document-types";
import { hasPermission } from "@/lib/utils/permissions"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Types | HR Management System",
  description:
    "Manage company document types, organize teams, and control document types structure within the HR management system.",
};

export default async function DocumentTypesPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions || []
  const canView = hasPermission(userPermissions, "view document types")

  if (!canView) {
    return <ForbiddenError />
  }

  return <DocumentTypesClient />
}