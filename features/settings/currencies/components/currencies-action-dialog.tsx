'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateCurrency,
  useUpdateCurrency,
} from '@/features/settings/currencies/api'
import { currencySchema, type CurrencyFormData } from '@/features/settings/currencies/schemas'
import { useOptionCountries } from '@/features/settings/countries/api'
import { type Currency } from '../types'

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
  FieldDescription,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CurrenciesActionDialogProps = {
  currentRow?: Currency
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CurrenciesActionDialog({
                                         currentRow,
                                         open,
                                         onOpenChange,
                                       }: CurrenciesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createCurrency, isPending: isCreating } = useCreateCurrency()
  const { mutate: updateCurrency, isPending: isUpdating } = useUpdateCurrency()
  const isLoading = isCreating || isUpdating

  const form = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        code: currentRow.code,
        symbol: currentRow.symbol,
        country_id: currentRow.country_id,
        precision: currentRow.precision ?? 2,
        symbol_native: currentRow.symbol_native ?? '',
        symbol_first: currentRow.symbol_first ?? true,
        decimal_mark: currentRow.decimal_mark ?? '.',
        thousands_separator: currentRow.thousands_separator ?? ',',
      }
      : {
        name: '',
        code: '',
        symbol: '',
        country_id: 0,
        precision: 2,
        symbol_native: '',
        symbol_first: true,
        decimal_mark: '.',
        thousands_separator: ',',
      },
  })

  const onSubmit = (values: CurrencyFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateCurrency({ id: currentRow.id, data: values }, options)
    } else {
      createCurrency(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Currency' : 'Add New Currency'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the currency details here. ' : 'Create a new currency here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <CurrencyForm form={form} onSubmit={onSubmit} id='currency-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='currency-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Currency' : 'Add New Currency'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the currency details here. ' : 'Create a new currency here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <CurrencyForm form={form} onSubmit={onSubmit} id='currency-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='currency-form' disabled={isLoading}>
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

interface CurrencyFormProps {
  form: UseFormReturn<CurrencyFormData>
  onSubmit: (data: CurrencyFormData) => void
  id: string
  className?: string
}

function CurrencyForm({ form, onSubmit, id, className }: CurrencyFormProps) {
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
              <FieldLabel htmlFor='currency-name'>Name <span className='text-destructive'>*</span></FieldLabel>
              <Input id='currency-name' placeholder='US Dollar' autoComplete='off' {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-code'>Code <span className='text-destructive'>*</span></FieldLabel>
                <Input id='currency-code' placeholder='USD' className="uppercase" autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='symbol'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-symbol'>Symbol <span className='text-destructive'>*</span></FieldLabel>
                <Input id='currency-symbol' placeholder='$' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='country_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='currency-country'>Country <span className='text-destructive'>*</span></FieldLabel>
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={isLoadingCountries}
              >
                <SelectTrigger id='currency-country'>
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

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='precision'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-precision'>Precision</FieldLabel>
                <Input
                  id='currency-precision'
                  type="number"
                  placeholder='2'
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='symbol_native'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-symbol-native'>Native Symbol</FieldLabel>
                <Input id='currency-symbol-native' placeholder='$' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='decimal_mark'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-decimal-mark'>Decimal Mark</FieldLabel>
                <Input id='currency-decimal-mark' placeholder='.' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='thousands_separator'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='currency-thousands-separator'>Thousands Separator</FieldLabel>
                <Input id='currency-thousands-separator' placeholder=',' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='symbol_first'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='currency-symbol-first'>Symbol First</FieldLabel>
                <FieldDescription>
                  Enable to place symbol before the amount (e.g. $100 vs 100$).
                </FieldDescription>
              </div>
              <Switch id='currency-symbol-first' checked={!!field.value} onCheckedChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}