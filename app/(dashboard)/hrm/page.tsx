import { auth } from '@/auth';
import { ForbiddenError } from '@/features/errors/forbidden';
import { HrmDashboardClient } from '@/features/hrm/dashboard/components/hrm-dashboard-client';
import { hasPermission } from '@/lib/utils/permissions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HR Dashboard | HR Management System',
  description: 'Overview of HR metrics and quick links.',
};

export default async function HrmDashboardPage() {
  const session = await auth();
  const userPermissions = session?.user?.user_permissions ?? [];
  const canView =
    hasPermission(userPermissions, 'view employees') ||
    hasPermission(userPermissions, 'view attendances') ||
    hasPermission(userPermissions, 'view leaves') ||
    hasPermission(userPermissions, 'view payroll');

  if (!canView) {
    return <ForbiddenError />;
  }

  return <HrmDashboardClient />;
}
