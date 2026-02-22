'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateCity,
  useUpdateCity,
} from '@/features/settings/cities/api'
import { citySchema, type CityFormData } from '@/features/settings/cities/schemas'
import { useOptionCountries, useStatesByCountry } from '@/features/settings/countries/api'
import { type City } from '../types'

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
import { Map } from '@/components/ui/map'

type CitiesActionDialogProps = {
  currentRow?: City
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CitiesActionDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: CitiesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createCity, isPending: isCreating } = useCreateCity()
  const { mutate: updateCity, isPending: isUpdating } = useUpdateCity()
  const isLoading = isCreating || isUpdating

  const form = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        country_id: currentRow.country_id,
        state_id: currentRow.state_id,
        country_code: currentRow.country_code ?? '',
        state_code: currentRow.state_code ?? '',
        latitude: currentRow.latitude ?? '',
        longitude: currentRow.longitude ?? '',
      }
      : {
        name: '',
        country_id: 0,
        state_id: 0,
        country_code: '',
        state_code: '',
        latitude: '',
        longitude: '',
      },
  })

  const onSubmit = (values: CityFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateCity({ id: currentRow.id, data: values }, options)
    } else {
      createCity(values, options)
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
            <DialogTitle>{isEdit ? 'Edit City' : 'Add New City'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the city details here. ' : 'Create a new city here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <CityForm form={form} onSubmit={onSubmit} id='city-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='city-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit City' : 'Add New City'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the city details here. ' : 'Create a new city here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <CityForm form={form} onSubmit={onSubmit} id='city-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='city-form' disabled={isLoading}>
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

interface CityFormProps {
  form: UseFormReturn<CityFormData>
  onSubmit: (data: CityFormData) => void
  id: string
  className?: string
}

function CityForm({ form, onSubmit, id, className }: CityFormProps) {
  const { data: countries = [], isLoading: isLoadingCountries } = useOptionCountries();

  const selectedCountryId = form.watch('country_id');
  const { data: states = [], isLoading: isLoadingStates } = useStatesByCountry(selectedCountryId || null);

  const [latValue, lngValue] = form.watch(['latitude', 'longitude']);
  const lat = parseFloat(latValue || '');
  const lng = parseFloat(lngValue || '');
  const hasCoordinates = !isNaN(lat) && !isNaN(lng);

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
              <FieldLabel htmlFor='city-name'>Name <span className='text-destructive'>*</span></FieldLabel>
              <Input id='city-name' placeholder='City name' autoComplete='off' {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='country_id'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-country'>Country <span className='text-destructive'>*</span></FieldLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                    form.setValue('state_id', 0); // Reset state when country changes
                  }}
                  disabled={isLoadingCountries}
                >
                  <SelectTrigger id='city-country'>
                    <SelectValue placeholder="Select country" />
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

          <Controller
            control={form.control}
            name='state_id'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-state'>State <span className='text-destructive'>*</span></FieldLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={!selectedCountryId || isLoadingStates}
                >
                  <SelectTrigger id='city-state'>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={String(state.value)}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='country_code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-country-code'>Country Code</FieldLabel>
                <Input id='city-country-code' placeholder='US' maxLength={2} className="uppercase" autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='state_code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-state-code'>State Code</FieldLabel>
                <Input id='city-state-code' placeholder='NY' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='latitude'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-latitude'>Latitude</FieldLabel>
                <Input id='city-latitude' placeholder='40.71280000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='longitude'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='city-longitude'>Longitude</FieldLabel>
                <Input id='city-longitude' placeholder='-74.00600000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Dynamically render map when valid coordinates are entered */}
        {hasCoordinates && (
          <div className='h-[200px] w-full rounded-md border overflow-hidden relative'>
            <Map lat={lat} lng={lng} zoom={10} />
          </div>
        )}
      </FieldGroup>
    </form>
  )
}