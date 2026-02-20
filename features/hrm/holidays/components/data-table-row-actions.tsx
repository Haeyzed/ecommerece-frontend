'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons';
import type { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Holiday } from '../types';
import { useHolidays } from './holidays-provider';
import { useApproveHoliday } from '../api';
import { useAuthSession } from '@/features/auth/api';

type DataTableRowActionsProps = {
  row: Row<Holiday>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useHolidays();
  const { data: session } = useAuthSession();
  const { mutate: approveHoliday, isPending: isApproving } = useApproveHoliday();
  const userPermissions = session?.user?.user_permissions || [];
  const canView = userPermissions.includes('view holidays');
  const canUpdate = userPermissions.includes('update holidays');
  const canDelete = userPermissions.includes('delete holidays');
  const canApprove = userPermissions.includes('approve holidays');
  const isPending = !row.original.is_approved;

  if (!canView && !canUpdate && !canDelete && !canApprove) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {canView && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original);
                setOpen('view');
              }}
            >
              View
              <DropdownMenuShortcut>
                <HugeiconsIcon icon={ViewIcon} strokeWidth={2} size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {(canUpdate || canDelete || (canApprove && isPending)) && <DropdownMenuSeparator />}
          </>
        )}

        {canApprove && isPending && (
          <DropdownMenuItem
            onClick={() => approveHoliday(row.original.id)}
            disabled={isApproving}
          >
            Approve
            <DropdownMenuShortcut>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        {canUpdate && (
          <>
            {(canDelete || (canApprove && isPending)) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original);
                setOpen('edit');
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {canDelete && <DropdownMenuSeparator />}
          </>
        )}

        {canDelete && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original);
              setOpen('delete');
            }}
            className="text-destructive focus:text-destructive"
          >
            Delete
            <DropdownMenuShortcut>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}