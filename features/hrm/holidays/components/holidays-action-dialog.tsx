'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import {
  useCreateHoliday,
  useUpdateHoliday,
} from '@/features/hrm/holidays/api';
import { holidaySchema, type HolidayFormData } from '@/features/hrm/holidays/schemas';
import type { Holiday } from '../types';

import { useApiClient } from '@/lib/api/api-client-client';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { DatePickerSingle } from '@/components/ui/date-picker';
import { useAuthSession } from '@/features/auth/api'

type HolidaysActionDialogProps = {
  currentRow?: Holiday;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HolidaysActionDialog({
  currentRow,
  open,
  onOpenChange,
}: HolidaysActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isEdit = !!currentRow;
  const { mutate: createHoliday, isPending: isCreating } = useCreateHoliday();
  const { mutate: updateHoliday, isPending: isUpdating } = useUpdateHoliday();
  const isLoading = isCreating || isUpdating;
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canApprove = userPermissions.includes('approve holidays')

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: isEdit && currentRow
      ? {
          user_id: currentRow.user_id ?? null,
          from_date: currentRow.from_date ?? '',
          to_date: currentRow.to_date ?? '',
          note: currentRow.note ?? null,
          is_approved: canApprove ? currentRow.is_approved ?? false : null,
          recurring: currentRow.recurring ?? null,
          region: currentRow.region ?? null,
        }
      : {
          user_id: null,
          from_date: '',
          to_date: '',
          note: null,
          is_approved: canApprove ? false : null,
          recurring: null,
          region: null,
        },
  });

  const onSubmit = (values: HolidayFormData) => {
    const options = {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    };

    if (isEdit && currentRow) {
      updateHoliday({ id: currentRow.id, data: values }, options);
    } else {
      createHoliday(values, options);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset();
    onOpenChange(value);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>{isEdit ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the leave request details here.'
                : 'Create a new leave request here.'}{' '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto py-1 pe-3">
            <HolidayForm form={form} onSubmit={onSubmit} id="holiday-form" canApprove={canApprove} />
          </div>

          <DialogFooter>
            <Button type="submit" form="holiday-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{isEdit ? 'Edit Holiday' : 'Add New Holiday'}</DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? 'Update the leave request details here.'
              : 'Create a new leave request here.'}{' '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">
          <HolidayForm form={form} onSubmit={onSubmit} id="holiday-form" canApprove={canApprove} />
        </div>

        <DrawerFooter>
          <Button type="submit" form="holiday-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface HolidayFormProps {
  form: UseFormReturn<HolidayFormData>;
  onSubmit: (data: HolidayFormData) => void;
  id: string;
  className?: string;
  canApprove: boolean;
}

function HolidayForm({ form, onSubmit, id, className, canApprove }: HolidayFormProps) {
  const { api } = useApiClient();
  const [userSelectOpen, setUserSelectOpen] = useState(false);

  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () =>
      api.get<Array<{ id: number; name: string; email: string }>>('/users', {
        params: { per_page: 100 },
      }),
    enabled: userSelectOpen,
  });

  const users = usersResponse?.data ?? [];

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="user_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="holiday-user">Assignee</FieldLabel>
              <Select
                open={userSelectOpen}
                onOpenChange={setUserSelectOpen}
                value={field.value != null ? String(field.value) : '__none__'}
                onValueChange={(value) =>
                  field.onChange(value === '__none__' ? null : Number(value))
                }
                disabled={isLoadingUsers}
              >
                <SelectTrigger id="holiday-user" data-invalid={!!fieldState.error}>
                  <SelectValue placeholder="Leave empty for current user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Leave empty for current user</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Optional. Defaults to you when creating.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="from_date"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="holiday-from">From date <span className="text-destructive">*</span></FieldLabel>
              <DatePickerSingle
                id="holiday-from"
                label={undefined}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Pick start date"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="to_date"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="holiday-to">To date <span className="text-destructive">*</span></FieldLabel>
              <DatePickerSingle
                id="holiday-to"
                label={undefined}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Pick end date"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="note"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="holiday-note">Note</FieldLabel>
              <Input
                id="holiday-note"
                placeholder="e.g. Annual leave"
                autoComplete="off"
                {...field}
                value={field.value ?? ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="region"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="holiday-region">Region</FieldLabel>
              <Input
                id="holiday-region"
                placeholder="e.g. HQ"
                autoComplete="off"
                {...field}
                value={field.value ?? ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {canApprove && (
        <Controller
          control={form.control}
          name="is_approved"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className="flex flex-row items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="holiday-approved">Approved</FieldLabel>
                <FieldDescription>
                  Mark this request as approved (e.g. when creating on behalf of someone).
                </FieldDescription>
              </div>
              <Switch
                id="holiday-approved"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        )}

        <Controller
          control={form.control}
          name="recurring"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className="flex flex-row items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="holiday-recurring">Recurring</FieldLabel>
                <FieldDescription>e.g. yearly recurring holiday.</FieldDescription>
              </div>
              <Switch
                id="holiday-recurring"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
