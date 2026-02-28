'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePayroll } from './payroll-provider';
import { useCreatePayrollRun } from '../api';

const currentYear = new Date().getFullYear();
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

export function PayrollCreateDialog() {
  const { open, setOpen } = usePayroll();
  const createRun = useCreatePayrollRun();
  const [month, setMonth] = useState(`${currentYear}-${currentMonth}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [y, m] = month.split('-').map(Number);
    await createRun.mutateAsync({ month: `${y}-${String(m).padStart(2, '0')}`, year: y });
    setOpen(null);
  };

  const isOpen = open === 'add';

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setOpen(v ? 'add' : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New payroll run</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="month">Month (YYYY-MM)</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRun.isPending}>
              Create run
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
