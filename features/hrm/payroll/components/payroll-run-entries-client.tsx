'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ConfigDrawer } from '@/components/config-drawer';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePayrollRun, usePayrollRunEntries, useGeneratePayrollEntries } from '../api';

interface PayrollRunEntriesClientProps {
  runId: number;
}

export function PayrollRunEntriesClient({ runId }: PayrollRunEntriesClientProps) {
  const { data: run, isLoading: runLoading } = usePayrollRun(runId);
  const { data: entriesData, isLoading: entriesLoading } = usePayrollRunEntries(runId, { per_page: 50 });
  const generateEntries = useGeneratePayrollEntries();

  const entries = entriesData?.data ?? [];
  const isLoading = runLoading || entriesLoading;

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hrm/payroll">Back to Payroll</Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Payroll run {run ? `${run.month} / ${run.year}` : `#${runId}`}
              </h2>
              <p className="text-muted-foreground">
                {run?.status ? `Status: ${run.status}` : 'Entries and payslips for this run.'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateEntries.mutateAsync(runId)}
            disabled={generateEntries.isPending}
          >
            Regenerate entries
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No entries yet. Click Regenerate entries to generate payslips.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.employee?.name ?? '-'}</TableCell>
                      <TableCell>{entry.employee?.employee_code ?? '-'}</TableCell>
                      <TableCell className="text-right">{Number(entry.gross_salary).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(entry.total_deductions).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(entry.net_salary).toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{entry.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Main>
    </AuthenticatedLayout>
  );
}
