'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ConfigDrawer } from '@/components/config-drawer';
import { Spinner } from '@/components/ui/spinner';
import { usePaginatedEmployees } from '@/features/hrm/employees/api';
import { usePaginatedAttendances } from '@/features/hrm/attendances/api';
import { usePaginatedLeaves } from '@/features/hrm/leaves/api';
import { usePaginatedPayrollRuns } from '@/features/hrm/payroll/api';

function useHrmDashboardCounts() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const employees = usePaginatedEmployees({ per_page: 1 });
  const attendances = usePaginatedAttendances({
    per_page: 1,
    start_date: today,
    end_date: today,
  });
  const pendingLeaves = usePaginatedLeaves({
    per_page: 1,
    status: 'pending',
  });
  const payrollRuns = usePaginatedPayrollRuns({
    per_page: 1,
    month,
    year,
  });

  const isLoading =
    employees.isLoading ||
    attendances.isLoading ||
    pendingLeaves.isLoading ||
    payrollRuns.isLoading;

  return {
    isLoading,
    totalEmployees: employees.data?.meta?.total ?? 0,
    attendanceToday: attendances.data?.meta?.total ?? 0,
    pendingLeaves: pendingLeaves.data?.meta?.total ?? 0,
    payrollRunsThisMonth: payrollRuns.data?.meta?.total ?? 0,
  };
}

export function HrmDashboardClient() {
  const {
    isLoading,
    totalEmployees,
    attendanceToday,
    pendingLeaves,
    payrollRunsThisMonth,
  } = useHrmDashboardCounts();

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <Header fixed>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className="flex min-h-[300px] items-center justify-center">
          <Spinner className="size-6" />
        </Main>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of HR metrics and quick links.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-colors hover:bg-muted/50">
            <Link href="/hrm/employees">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  View all employees
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-colors hover:bg-muted/50">
            <Link href="/hrm/attendances">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceToday}</div>
                <p className="text-xs text-muted-foreground">
                  Check-ins recorded today
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-colors hover:bg-muted/50">
            <Link href="/hrm/leaves?status=pending">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Leaves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingLeaves}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-colors hover:bg-muted/50">
            <Link href="/hrm/payroll">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Payroll Runs (This Month)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollRunsThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  Payroll runs this month
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>
              Navigate to HRM modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              href="/hrm/departments"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Departments
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/hrm/designations"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Designations
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/hrm/shifts"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Shifts
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/hrm/leave-types"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Leave Types
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/hrm/holidays"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Holidays
            </Link>
          </CardContent>
        </Card>
      </Main>
    </AuthenticatedLayout>
  );
}
