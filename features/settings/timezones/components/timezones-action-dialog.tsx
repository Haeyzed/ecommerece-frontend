'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateTimezone,
  useUpdateTimezone,
} from '@/features/settings/timezones/api'
import { timezoneSchema, type TimezoneFormData } from '@/features/settings/timezones/schemas'
import { useOptionCountries } from '@/features/settings/countries/api'
import { type Timezone } from '../types'

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TimezonesActionDialogProps = {
  currentRow?: Timezone
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimezonesActionDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: TimezonesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createTimezone, isPending: isCreating } = useCreateTimezone()
  const { mutate: updateTimezone, isPending: isUpdating } = useUpdateTimezone()
  const isLoading = isCreating || isUpdating

  const form = useForm<TimezoneFormData>({
    resolver: zodResolver(timezoneSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        country_id: currentRow.country_id,
      }
      : {
        name: '',
        country_id: 0,
      },
  })

  const onSubmit = (values: TimezoneFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateTimezone({ id: currentRow.id, data: values }, options)
    } else {
      createTimezone(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Timezone' : 'Add New Timezone'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the timezone details here. ' : 'Create a new timezone here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <TimezoneForm form={form} onSubmit={onSubmit} id='timezone-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='timezone-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Timezone' : 'Add New Timezone'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the timezone details here. ' : 'Create a new timezone here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <TimezoneForm form={form} onSubmit={onSubmit} id='timezone-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='timezone-form' disabled={isLoading}>
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

interface TimezoneFormProps {
  form: UseFormReturn<TimezoneFormData>
  onSubmit: (data: TimezoneFormData) => void
  id: string
  className?: string
}

function TimezoneForm({ form, onSubmit, id, className }: TimezoneFormProps) {
  const { data: countries = [], isLoading: isLoadingCountries } = useOptionCountries();

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
              <FieldLabel htmlFor='timezone-name'>Name <span className='text-destructive'>*</span></FieldLabel>
              <Input id='timezone-name' placeholder='Africa/Lagos' autoComplete='off' {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='country_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='timezone-country'>Country <span className='text-destructive'>*</span></FieldLabel>
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={isLoadingCountries}
              >
                <SelectTrigger id='timezone-country'>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={String(country.value)}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}