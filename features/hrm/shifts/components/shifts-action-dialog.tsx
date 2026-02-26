'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'

import {
  useCreateShift,
  useUpdateShift
} from '@/features/hrm/shifts/api'
import { shiftSchema, type ShiftFormData } from '@/features/hrm/shifts/schemas'
import { type Shift } from '../types'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { TimePickerInput } from "@/components/time-picker-input"
import { TimePeriodSelect } from "@/components/period-select"
import { Period } from "@/lib/utils/time-picker-utils"
import { Label } from '@/components/ui/label'

function TimePickerWrapper({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [period, setPeriod] = React.useState<Period>("AM");

  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;
    const [hours, minutes] = value.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  });

  React.useEffect(() => {
    if (value) {
      const [hours] = value.split(':').map(Number);
      setPeriod(hours >= 12 ? "PM" : "AM");
    }
  }, [value]);

  const handleSetDate = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onChange(format(newDate, 'HH:mm'));
    } else {
      onChange('');
    }
  };

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={handleSetDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <span className="mb-2 text-muted-foreground font-bold">:</span>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={handleSetDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <TimePeriodSelect
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={handleSetDate}
          ref={periodRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
    </div>
  );
}

type ShiftsActionDialogProps = {
  currentRow?: Shift
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShiftsActionDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: ShiftsActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createShift, isPending: isCreating } = useCreateShift()
  const { mutate: updateShift, isPending: isUpdating } = useUpdateShift()
  const isLoading = isCreating || isUpdating

  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        start_time: currentRow.start_time.substring(0, 5),
        end_time: currentRow.end_time.substring(0, 5),
        grace_in: currentRow.grace_in,
        grace_out: currentRow.grace_out,
        total_hours: currentRow.total_hours,
        is_active: currentRow.is_active,
      }
      : {
        name: '',
        start_time: '08:00',
        end_time: '16:00',
        grace_in: 15,
        grace_out: 10,
        total_hours: 8,
        is_active: true,
      },
  })

  const onSubmit = (values: ShiftFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateShift({ id: currentRow.id, data: values }, options)
    } else {
      createShift(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the shift details here. ' : 'Create a new shift here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <ShiftForm form={form} onSubmit={onSubmit} id='shift-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='shift-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className='mr-2 size-4' />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Shift' : 'Add New Shift'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the shift details here. ' : 'Create a new shift here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <ShiftForm form={form} onSubmit={onSubmit} id='shift-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='shift-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className='mr-2 size-4' />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface ShiftFormProps {
  form: UseFormReturn<ShiftFormData>
  onSubmit: (data: ShiftFormData) => void
  id: string
  className?: string
}

function ShiftForm({ form, onSubmit, id, className }: ShiftFormProps) {
  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='name'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='shift-name'>Shift Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='shift-name'
                placeholder='e.g. Morning Shift'
                autoComplete='off'
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

          <Controller
            control={form.control}
            name='start_time'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Start Time <span className="text-destructive">*</span></FieldLabel>
                <TimePickerWrapper value={field.value} onChange={field.onChange} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='end_time'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>End Time <span className="text-destructive">*</span></FieldLabel>
                <TimePickerWrapper value={field.value} onChange={field.onChange} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='grace_in'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='grace-in'>Grace In (mins) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='grace-in'
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='grace_out'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='grace-out'>Grace Out (mins) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='grace-out'
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='total_hours'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='total-hours'>Total Hours <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='total-hours'
                  type="number"
                  step="0.5"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='shift-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the shift from the system.
                </FieldDescription>
              </div>
              <Switch
                id='shift-active'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}