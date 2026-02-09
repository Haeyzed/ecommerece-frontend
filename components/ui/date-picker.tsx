'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { CalendarIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Field, FieldLabel } from '@/components/ui/field'

type DatePickerSingleProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  label?: string
}

/**
 * Single date picker: opens a calendar in a popover.
 */
export function DatePickerSingle({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  id,
  className,
  label,
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)

  const trigger = (
    <Button
      id={id}
      variant="outline"
      className={cn('justify-start px-2.5 font-normal', className)}
      disabled={disabled}
    >
      <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} data-icon="inline-start" />
      {value ? format(value, 'PPP') : <span>{placeholder}</span>}
    </Button>
  )

  const content = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )

  if (label) {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {content}
      </Field>
    )
  }

  return content
}

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  label?: string
}

/**
 * Date range picker: opens a calendar in a popover with range selection.
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  disabled,
  id,
  className,
  label,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const trigger = (
    <Button
      id={id}
      variant="outline"
      className={cn('justify-start px-2.5 font-normal', className)}
      disabled={disabled}
    >
      <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} data-icon="inline-start" />
      {value?.from ? (
        value.to ? (
          <>
            {format(value.from, 'LLL dd, y')} – {format(value.to, 'LLL dd, y')}
          </>
        ) : (
          format(value.from, 'LLL dd, y')
        )
      ) : (
        <span>{placeholder}</span>
      )}
    </Button>
  )

  const content = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
        <div className="flex gap-2 border-t p-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

  if (label) {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {content}
      </Field>
    )
  }

  return content
}
