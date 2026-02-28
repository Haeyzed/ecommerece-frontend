'use client';

import { useRouter } from 'next/navigation';
import { type Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon, Receipt, SparklesIcon } from '@hugeicons/core-free-icons';
import { useGeneratePayrollEntries } from '../api';
import type { PayrollRun } from '../types';

interface PayrollRunRowActionsProps {
  row: Row<PayrollRun>;
}

export function PayrollRunRowActions({ row }: PayrollRunRowActionsProps) {
  const router = useRouter();
  const run = row.original;
  const generateEntries = useGeneratePayrollEntries();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Actions">
          <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => generateEntries.mutateAsync(run.id)}
          disabled={generateEntries.isPending}
        >
          <HugeiconsIcon icon={SparklesIcon} className="size-4 me-2" />
          Generate entries
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/hrm/payroll/${run.id}`)}>
          <HugeiconsIcon icon={Receipt} className="size-4 me-2" />
          View entries
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
