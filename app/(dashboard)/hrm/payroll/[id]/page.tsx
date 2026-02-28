import { auth } from '@/auth';
import { ForbiddenError } from '@/features/errors/forbidden';
import { PayrollRunEntriesClient } from '@/features/hrm/payroll/components/payroll-run-entries-client';
import { hasPermission } from '@/lib/utils/permissions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payroll run entries | HR Management System',
  description: 'View and manage payroll entries for this run.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PayrollRunEntriesPage({ params }: PageProps) {
  const session = await auth();
  const userPermissions = session?.user?.user_permissions ?? [];
  const canView = hasPermission(userPermissions, 'view payroll') || hasPermission(userPermissions, 'view payroll runs');

  if (!canView) {
    return <ForbiddenError />;
  }

  const { id } = await params;
  const runId = parseInt(id, 10);
  if (Number.isNaN(runId)) {
    return <div className="p-4">Invalid run ID</div>;
  }

  return <PayrollRunEntriesClient runId={runId} />;
}
