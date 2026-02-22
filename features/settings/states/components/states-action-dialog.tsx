'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateState,
  useUpdateState,
} from '@/features/settings/states/api'
import { stateSchema, type StateFormData } from '@/features/settings/states/schemas'
import { useOptionCountries } from '@/features/settings/countries/api'
import { type State } from '../types'

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

type StatesActionDialogProps = {
  currentRow?: State
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatesActionDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: StatesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createState, isPending: isCreating } = useCreateState()
  const { mutate: updateState, isPending: isUpdating } = useUpdateState()
  const isLoading = isCreating || isUpdating

  const form = useForm<StateFormData>({
    resolver: zodResolver(stateSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        country_id: currentRow.country_id,
        code: currentRow.code ?? '',
        country_code: currentRow.country_code ?? '',
        state_code: currentRow.state_code ?? '',
        type: currentRow.type ?? '',
        latitude: currentRow.latitude ?? '',
        longitude: currentRow.longitude ?? '',
      }
      : {
        name: '',
        country_id: 0,
        code: '',
        country_code: '',
        state_code: '',
        type: '',
        latitude: '',
        longitude: '',
      },
  })

  const onSubmit = (values: StateFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateState({ id: currentRow.id, data: values }, options)
    } else {
      createState(values, options)
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
            <DialogTitle>{isEdit ? 'Edit State' : 'Add New State'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the state details here. ' : 'Create a new state here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <StateForm form={form} onSubmit={onSubmit} id='state-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='state-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit State' : 'Add New State'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the state details here. ' : 'Create a new state here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <StateForm form={form} onSubmit={onSubmit} id='state-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='state-form' disabled={isLoading}>
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

interface StateFormProps {
  form: UseFormReturn<StateFormData>
  onSubmit: (data: StateFormData) => void
  id: string
  className?: string
}

function StateForm({ form, onSubmit, id, className }: StateFormProps) {
  const { data: countries = [], isLoading: isLoadingCountries } = useOptionCountries();
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
              <FieldLabel htmlFor='state-name'>Name <span className='text-destructive'>*</span></FieldLabel>
              <Input id='state-name' placeholder='State name' autoComplete='off' {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='country_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='state-country'>Country <span className='text-destructive'>*</span></FieldLabel>
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={isLoadingCountries}
              >
                <SelectTrigger id='state-country'>
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
            name='code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='state-code'>Code</FieldLabel>
                <Input id='state-code' placeholder='Code' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='state_code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='state-state-code'>State Code</FieldLabel>
                <Input id='state-state-code' placeholder='NY' autoComplete='off' {...field} value={field.value ?? ''} />
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
                <FieldLabel htmlFor='state-country-code'>Country Code (ISO2)</FieldLabel>
                <Input id='state-country-code' placeholder='US' maxLength={2} className="uppercase" autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='type'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='state-type'>Type</FieldLabel>
                <Input id='state-type' placeholder='state, province...' autoComplete='off' {...field} value={field.value ?? ''} />
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
                <FieldLabel htmlFor='state-latitude'>Latitude</FieldLabel>
                <Input id='state-latitude' placeholder='38.00000000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='longitude'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='state-longitude'>Longitude</FieldLabel>
                <Input id='state-longitude' placeholder='-97.00000000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        {hasCoordinates && (
          <div className='h-[200px] w-full rounded-md border overflow-hidden relative'>
            <Map lat={lat} lng={lng} zoom={6} />
          </div>
        )}
      </FieldGroup>
    </form>
  )
}