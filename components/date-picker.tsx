"use client"

import * as React from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDownIcon } from "@hugeicons/core-free-icons"

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function DatePicker({
                                     value,
                                     onChange,
                                     placeholder = "Pick a date",
                                     error,
                                     disabled
                                   }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-start px-2.5 font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
            <HugeiconsIcon
              icon={ArrowDownIcon}
              strokeWidth={2}
              className="ml-auto size-4 opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown" // Enables Month/Year dropdowns
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              // Optionally close on select for better UX in single-mode
              // setOpen(false)
            }}
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
}