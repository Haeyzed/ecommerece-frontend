'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { type DateRange } from 'react-day-picker'
import { HugeiconsIcon } from '@hugeicons/react'
import { CalendarIcon } from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  label?: string
  description?: string
  placeholder?: string
  className?: string
}

export function DateRangePicker({
                                  value,
                                  onChange,
                                  label = "Date Range",
                                  description,
                                  placeholder = "Pick a date range",
                                  className,
                                }: DateRangePickerProps) {
  return (
    <Field className={cn("grid gap-1.5", className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal px-2.5",
              !value && "text-muted-foreground"
            )}
          >
            <HugeiconsIcon
              icon={CalendarIcon}
              strokeWidth={2}
              className="mr-2 size-4"
            />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}