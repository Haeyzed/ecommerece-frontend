'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { approvalStatusTypes } from '../constants';
import type { Holiday } from '../types';

type HolidaysViewDialogProps = {
  currentRow?: Holiday;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HolidaysViewDialog({
  currentRow,
  open,
  onOpenChange,
}: HolidaysViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!currentRow) return null;

  const status = currentRow.is_approved ? 'approved' : 'pending';
  const statusBadgeColor = approvalStatusTypes.get(status);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Holiday Details</DialogTitle>
            <DialogDescription>
              View leave request information below.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-2">
            <HolidaysView currentRow={currentRow} statusBadgeColor={statusBadgeColor} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Holiday Details</DrawerTitle>
          <DrawerDescription>View leave request information below.</DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[80vh] overflow-y-auto px-4">
          <HolidaysView currentRow={currentRow} statusBadgeColor={statusBadgeColor} />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface HolidaysViewProps {
  className?: string;
  currentRow: Holiday;
  statusBadgeColor?: string;
}

function HolidaysView({ className, currentRow, statusBadgeColor }: HolidaysViewProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">From date</div>
          <div className="text-sm font-medium">
            {currentRow.from_date
              ? new Date(currentRow.from_date).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">To date</div>
          <div className="text-sm font-medium">
            {currentRow.to_date
              ? new Date(currentRow.to_date).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </div>

      {currentRow.note && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Note</div>
          <div className="text-sm font-medium">{currentRow.note}</div>
        </div>
      )}

      {currentRow.region && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Region</div>
          <div className="text-sm font-medium">{currentRow.region}</div>
        </div>
      )}

      {currentRow.user && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Assignee</div>
          <div className="flex flex-col text-sm">
            <span className="font-medium">{currentRow.user.name}</span>
            <span className="text-muted-foreground">{currentRow.user.email}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge variant="outline" className={cn('capitalize', statusBadgeColor)}>
          {currentRow.is_approved ? 'approved' : 'pending'}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Recurring</div>
        <div className="text-sm font-medium">
          {currentRow.recurring == null ? 'N/A' : currentRow.recurring ? 'Yes' : 'No'}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Created at</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Updated at</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.updated_at
              ? new Date(currentRow.updated_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
