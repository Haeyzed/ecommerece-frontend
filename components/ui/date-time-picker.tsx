'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { HugeiconsIcon } from '@hugeicons/react'
import { CalendarIcon, Clock03Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Field, FieldLabel } from '@/components/ui/field'

type DateTimePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  datePlaceholder?: string
  disabled?: boolean
  id?: string
  className?: string
  label?: string
}

/**
 * Date and time picker: calendar for date + time input for time of day.
 * Value is a single Date; time is stored in the same Date.
 */
export function DateTimePicker({
  value,
  onChange,
  datePlaceholder = 'Pick date and time',
  disabled,
  id,
  className,
  label,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState(() => {
    if (value) {
      return format(value, 'HH:mm:ss')
    }
    return '00:00:00'
  })

  React.useEffect(() => {
    if (value) {
      setTimeValue(format(value, 'HH:mm:ss'))
    } else {
      setTimeValue('00:00:00')
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }
    const [h, m, s] = timeValue.split(':').map(Number)
    const next = new Date(date)
    next.setHours(h ?? 0, m ?? 0, s ?? 0, 0)
    onChange?.(next)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setTimeValue(v || '00:00:00')
    if (value) {
      const [h, m, s] = (v || '00:00:00').split(':').map(Number)
      const next = new Date(value)
      next.setHours(h ?? 0, m ?? 0, s ?? 0, 0)
      onChange?.(next)
    }
  }

  const displayLabel = value
    ? `${format(value, 'LLL dd, y')} ${format(value, 'HH:mm')}`
    : datePlaceholder

  const trigger = (
    <Button
      id={id}
      variant="outline"
      className={cn('justify-start px-2.5 font-normal', className)}
      disabled={disabled}
    >
      <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} data-icon="inline-start" />
      {displayLabel}
    </Button>
  )

  const content = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          className="rounded-b-none border-b"
        />
        <div className="p-3">
          <Field>
            <FieldLabel className="text-xs">Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="time"
                step="1"
                value={timeValue}
                onChange={handleTimeChange}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <div className="flex gap-2 border-t p-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(false)}>
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
