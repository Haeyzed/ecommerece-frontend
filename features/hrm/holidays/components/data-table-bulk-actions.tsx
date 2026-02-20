'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, Upload01Icon } from '@hugeicons/core-free-icons';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table';
import type { Holiday } from '../types';
import { HolidaysExportDialog } from './holidays-export-dialog';
import { HolidaysMultiDeleteDialog } from './holidays-multi-delete-dialog';
import { useAuthSession } from '@/features/auth/api';

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => (row.original as Holiday).id);

  const { data: session } = useAuthSession();
  const userPermissions = session?.user?.user_permissions || [];

  const canDelete = userPermissions.includes('delete holidays');
  const canExport = userPermissions.includes('export holidays');

  if (!canDelete && !canExport) return null;

  return (
    <>
      <BulkActionsToolbar table={table} entityName="holiday">
        {canExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowExportDialog(true)}
                className="size-8"
                aria-label="Export selected holidays"
                title="Export selected holidays"
              >
                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                <span className="sr-only">Export selected holidays</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected holidays</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="size-8"
                aria-label="Delete selected holidays"
                title="Delete selected holidays"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                <span className="sr-only">Delete selected holidays</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected holidays</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      {canDelete && (
        <HolidaysMultiDeleteDialog
          table={table}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        />
      )}

      {canExport && (
        <HolidaysExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          ids={selectedIds}
        />
      )}
    </>
  );
}
