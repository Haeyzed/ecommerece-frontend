'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'

import {
  useCreateAttendance,
  useUpdateAttendance
} from '@/features/hrm/attendances/api'
import { attendanceSchema, type AttendanceFormData } from '@/features/hrm/attendances/schemas'
import { type Attendance } from '../types'
import { useOptionEmployees } from '@/features/hrm/employees/api'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { Spinner } from '@/components/ui/spinner'
import { DatePicker } from '@/components/date-picker'
import { TimePickerInput } from "@/components/time-picker-input"
import { TimePeriodSelect } from "@/components/period-select"
import { Period } from "@/lib/utils/time-picker-utils"
import { Label } from '@/components/ui/label'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

// --- TIME PICKER WRAPPER ---
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
      <span className="mb-2 text-muted-foreground font-bold">{' '}</span>
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

type AttendancesActionDialogProps = {
  currentRow?: Attendance
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttendancesActionDialog({
                                          currentRow,
                                          open,
                                          onOpenChange,
                                        }: AttendancesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createAttendance, isPending: isCreating } = useCreateAttendance()
  const { mutate: updateAttendance, isPending: isUpdating } = useUpdateAttendance()
  const isLoading = isCreating || isUpdating

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: isEdit && currentRow
      ? {
        employee_ids: [currentRow.employee_id],
        date: currentRow.date,
        checkin: currentRow.checkin ? currentRow.checkin.substring(0, 5) : '',
        checkout: currentRow.checkout ? currentRow.checkout.substring(0, 5) : '',
        note: currentRow.note || '',
      }
      : {
        employee_ids: [],
        date: format(new Date(), 'yyyy-MM-dd'),
        checkin: '08:00',
        checkout: '',
        note: '',
      },
  })

  const onSubmit = (values: AttendanceFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      // Exclude employee_ids because update endpoints update single records and don't accept an array of ids.
      const { employee_ids, ...updateData } = values
      updateAttendance({ id: currentRow.id, data: updateData }, options)
    } else {
      createAttendance(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Attendance' : 'Add New Attendance'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the attendance details here. ' : 'Record attendance for employees here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <AttendanceForm form={form} onSubmit={onSubmit} id='attendance-form' isEdit={isEdit} />
          </div>

          <DialogFooter>
            <Button type='submit' form='attendance-form' disabled={isLoading}>
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
    <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Attendance' : 'Add New Attendance'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the attendance details here. ' : 'Record attendance for employees here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <AttendanceForm form={form} onSubmit={onSubmit} id='attendance-form' isEdit={isEdit} />
        </div>

        <DrawerFooter>
          <Button type='submit' form='attendance-form' disabled={isLoading}>
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

interface AttendanceFormProps {
  form: UseFormReturn<AttendanceFormData>
  onSubmit: (data: AttendanceFormData) => void
  id: string
  className?: string
  isEdit: boolean
}

function AttendanceForm({ form, onSubmit, id, className, isEdit }: AttendanceFormProps) {
  const { data: optionEmployees = [] } = useOptionEmployees()
  const anchor = useComboboxAnchor()

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>

        {/* Employee Selection (Multiple Combobox) */}
        <Controller
          control={form.control}
          name="employee_ids"
          render={({ field, fieldState }) => {
            // FIX: Typed the predicate to explicitly match { value: number; label: string }
            const selectedItems = field.value
              ? field.value
                .map((id) => optionEmployees.find((opt) => Number(opt.value) === id))
                .filter((opt): opt is { value: number; label: string } => !!opt)
              : []

            return (
              <Field data-invalid={!!fieldState.error} className="flex flex-col">
                <FieldLabel htmlFor="attendance-employees">
                  Employees <span className="text-destructive">*</span>
                </FieldLabel>
                <Combobox
                  multiple
                  autoHighlight
                  items={optionEmployees}
                  itemToStringLabel={(item) => item.label}
                  value={selectedItems}
                  onValueChange={(items) => {
                    field.onChange(items.map((item) => Number(item.value)))
                  }}
                  isItemEqualToValue={(a, b) => Number(a?.value) === Number(b?.value)}
                >
                  <ComboboxChips ref={anchor} id="attendance-employees" className={cn(isEdit && "opacity-50 cursor-not-allowed")}>
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((item: { value: number; label: string }) => (
                            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput
                            placeholder={isEdit ? "Cannot change employee" : "Select employees..."}
                            disabled={isEdit}
                          />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No employees found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>
                  {isEdit ? "You cannot modify the employee during an edit." : "Select one or more employees to mark attendance."}
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        {/* Date */}
        <Controller
          control={form.control}
          name='date'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className="flex flex-col">
              <FieldLabel>Date <span className="text-destructive">*</span></FieldLabel>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Pick a date"
                error={fieldState.error?.message}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Check-In Time */}
        <Controller
          control={form.control}
          name='checkin'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Check-In Time <span className="text-destructive">*</span></FieldLabel>
              <TimePickerWrapper value={field.value} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Check-Out Time */}
        <Controller
          control={form.control}
          name='checkout'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Check-Out Time</FieldLabel>
              <TimePickerWrapper value={field.value || ''} onChange={field.onChange} />
              <FieldDescription>Leave empty if employee hasn't checked out yet.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Note */}
        <Controller
          control={form.control}
          name='note'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='attendance-note'>Note / Reason</FieldLabel>
              <Textarea
                id='attendance-note'
                placeholder='Any additional details...'
                className='resize-none'
                {...field}
                value={field.value || ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

      </FieldGroup>
    </form>
  )
}