"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarIcon, Clock03Icon, ArrowDownIcon } from "@hugeicons/core-free-icons"

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  error?: string
  placeholder?: string
}

export function DateTimePicker({
                                 value,
                                 onChange,
                                 error,
                                 placeholder = "Select date & time",
                               }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Sync internal time string with the Date value
  const timeValue = value ? format(value, "HH:mm:ss") : "00:00:00"

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange?.(undefined)
      return
    }

    // If we have an existing value, preserve the time when changing the date
    if (value) {
      newDate.setHours(value.getHours())
      newDate.setMinutes(value.getMinutes())
      newDate.setSeconds(value.getSeconds())
    }

    onChange?.(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value // HH:mm:ss
    if (!timeString) return

    const baseDate = value || new Date()
    const [hours, minutes, seconds] = timeString.split(':').map(Number)

    const newDate = new Date(baseDate)
    newDate.setHours(hours || 0)
    newDate.setMinutes(minutes || 0)
    newDate.setSeconds(seconds || 0)

    onChange?.(newDate)
  }

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start px-2.5 font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} className="mr-2 size-4" />
            {value && isValid(value) ? (
              format(value, "PPP HH:mm:ss")
            ) : (
              <span>{placeholder}</span>
            )}
            <HugeiconsIcon icon={ArrowDownIcon} strokeWidth={2} className="ml-auto size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateSelect}
                initialFocus
              />
            </CardContent>
            <CardFooter className="bg-muted/50 border-t p-3">
              <Field className="w-full">
                <FieldLabel htmlFor="time-input" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Time (HH:MM:SS)
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="time-input"
                    type="time"
                    step="1"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Clock03Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </CardFooter>
            <div className="p-2 border-t">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </Card>
        </PopoverContent>
      </Popover>
  )
}