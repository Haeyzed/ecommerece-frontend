'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  CancelCircleIcon,
  CloudUploadIcon,
  Edit01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateBiller,
  useUpdateBiller
} from '../api'
import { billerSchema, type BillerFormData } from '../schemas'
import { type Biller } from '../types'

import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import { ImageZoom } from '@/components/ui/image-zoom'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { useOptionCountries } from '@/features/settings/countries/api'
import { useStatesByCountry } from '@/features/settings/countries/api'
import { useCitiesByState } from '@/features/settings/states/api'

type BillerActionDialogProps = {
  currentRow?: Biller
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BillersActionDialog({
                                      currentRow,
                                      open,
                                      onOpenChange,
                                    }: BillerActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createBiller, isPending: isCreating } = useCreateBiller()
  const { mutate: updateBiller, isPending: isUpdating } = useUpdateBiller()
  const isLoading = isCreating || isUpdating

  const form = useForm<BillerFormData>({
    resolver: zodResolver(billerSchema),
    defaultValues: isEdit
      ? {
        name: currentRow.name,
        company_name: currentRow.company_name,
        vat_number: currentRow.vat_number || '',
        email: currentRow.email,
        phone_number: currentRow.phone_number,
        address: currentRow.address,
        country_id: currentRow.country_id ?? undefined,
        state_id: currentRow.state_id ?? undefined,
        city_id: currentRow.city_id ?? undefined,
        postal_code: currentRow.postal_code || '',
        is_active: currentRow.is_active,
        image: [],
      }
      : {
        name: '',
        company_name: '',
        vat_number: '',
        email: '',
        phone_number: '',
        address: '',
        country_id: undefined,
        state_id: undefined,
        city_id: undefined,
        postal_code: '',
        is_active: true,
        image: [],
      },
  })

  const onSubmit = (values: BillerFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateBiller({ id: currentRow.id, data: values }, options)
    } else {
      createBiller(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Biller' : 'Add New Biller'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the biller details here. ' : 'Create a new biller here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <BillerForm
              form={form}
              onSubmit={onSubmit}
              id='biller-form'
              isEdit={isEdit}
              currentRow={currentRow}
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='biller-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
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
          <DrawerTitle>{isEdit ? 'Edit Biller' : 'Add New Biller'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the biller details here. ' : 'Create a new biller here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <BillerForm
            form={form}
            onSubmit={onSubmit}
            id='biller-form'
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='biller-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
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

type OptionItem = { value: number; label: string }

interface BillerLocationComboboxesProps {
  form: UseFormReturn<BillerFormData>
  currentRow?: Biller
}

function BillerLocationComboboxes({ form, currentRow }: BillerLocationComboboxesProps) {
  const countryId = form.watch('country_id')
  const stateId = form.watch('state_id')
  const cityId = form.watch('city_id')

  const { data: countryOptions = [] } = useOptionCountries()
  const { data: statesData = [] } = useStatesByCountry(countryId ?? null)
  const { data: citiesData = [] } = useCitiesByState(stateId ?? null)

  const stateOptions: OptionItem[] = statesData.map((s: { value?: number; id?: number; label?: string; name?: string }) => ({
    value: s.value ?? s.id ?? 0,
    label: s.label ?? s.name ?? '',
  }))
  const cityOptions: OptionItem[] = citiesData.map((c: { value?: number; id?: number; label?: string; name?: string }) => ({
    value: c.value ?? c.id ?? 0,
    label: c.label ?? c.name ?? '',
  }))

  const selectedCountry =
    countryOptions.find((c) => c.value === countryId) ??
    (currentRow?.country ? { value: currentRow.country.id, label: currentRow.country.name } : null)
  const selectedState =
    stateOptions.find((s) => s.value === stateId) ??
    (currentRow?.state ? { value: currentRow.state.id, label: currentRow.state.name } : null)
  const selectedCity =
    cityOptions.find((c) => c.value === cityId) ??
    (currentRow?.city ? { value: currentRow.city.id, label: currentRow.city.name } : null)

  return (
    <>
      <Controller
        control={form.control}
        name='country_id'
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error} className='flex flex-col'>
            <FieldLabel htmlFor='biller-country'>Country</FieldLabel>
            <Combobox
              items={countryOptions}
              itemToStringLabel={(item) => item.label}
              value={selectedCountry}
              onValueChange={(item) => {
                field.onChange(item?.value ?? null)
                form.setValue('state_id', null)
                form.setValue('city_id', null)
              }}
              isItemEqualToValue={(a, b) => a?.value === b?.value}
            >
              <ComboboxInput id='biller-country' name='biller-country' placeholder='Select country...' showClear />
              <ComboboxContent>
                <ComboboxEmpty>No country found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name='state_id'
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error} className='flex flex-col'>
            <FieldLabel htmlFor='biller-state'>State</FieldLabel>
            <Combobox
              items={stateOptions}
              itemToStringLabel={(item) => item.label}
              value={selectedState}
              onValueChange={(item) => {
                field.onChange(item?.value ?? null)
                form.setValue('city_id', null)
              }}
              isItemEqualToValue={(a, b) => a?.value === b?.value}
            >
              <ComboboxInput id='biller-state' name='biller-state' placeholder='Select state...' showClear disabled={!countryId} />
              <ComboboxContent>
                <ComboboxEmpty>No state found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name='city_id'
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error} className='flex flex-col'>
            <FieldLabel htmlFor='biller-city'>City</FieldLabel>
            <Combobox
              items={cityOptions}
              itemToStringLabel={(item) => item.label}
              value={selectedCity}
              onValueChange={(item) => {
                field.onChange(item?.value ?? null)
              }}
              isItemEqualToValue={(a, b) => a?.value === b?.value}
            >
              <ComboboxInput id='biller-city' name='biller-city' placeholder='Select city...' showClear disabled={!stateId} />
              <ComboboxContent>
                <ComboboxEmpty>No city found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  )
}

interface BillerFormProps {
  form: UseFormReturn<BillerFormData>
  onSubmit: (data: BillerFormData) => void
  id: string
  className?: string
  isEdit: boolean
  currentRow?: Biller
}

function BillerForm({ form, onSubmit, id, className, isEdit, currentRow }: BillerFormProps) {
  const { resolvedTheme } = useTheme()

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='image'
          render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
            const existingImageUrl = isEdit && currentRow?.image_url ? currentRow.image_url : null
            const hasNewImage = value instanceof File || (Array.isArray(value) && value.length > 0)

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-image'>Image</FieldLabel>

                {existingImageUrl && !hasNewImage && (
                  <div className='mb-3 flex items-center gap-3 rounded-md border p-3'>
                    <div className='relative size-16 overflow-hidden rounded-md bg-muted'>
                      <ImageZoom
                        backdropClassName={cn(
                          resolvedTheme === 'dark'
                            ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                            : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                        )}
                      >
                        <Image
                          src={existingImageUrl}
                          alt={currentRow?.name || 'Biller image'}
                          width={64}
                          height={64}
                          className='h-full w-full object-cover'
                          unoptimized
                        />
                      </ImageZoom>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Current Image</p>
                      <p className='text-xs text-muted-foreground'>
                        Upload a new image to replace this one
                      </p>
                    </div>
                  </div>
                )}

                <FileUpload
                  value={value as File[] | undefined}
                  onValueChange={onChange}
                  accept='image/*'
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  onFileReject={(_, message) => {
                    form.setError('image', {
                      message,
                    })
                  }}
                >
                  <FileUploadDropzone className='flex-row flex-wrap border-dotted text-center'>
                    <HugeiconsIcon icon={CloudUploadIcon} className='size-4' />
                    Drag and drop or
                    <FileUploadTrigger asChild>
                      <Button variant='link' size='sm' className='p-0'>
                        choose file
                      </Button>
                    </FileUploadTrigger>
                    to upload
                  </FileUploadDropzone>
                  <FileUploadList>
                    {value?.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-7'
                          >
                            <HugeiconsIcon icon={CancelCircleIcon} className='size-4' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                <FieldDescription>
                  JPEG, PNG, JPG, GIF, or WebP. Max 5MB.
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-name'>Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='biller-name'
                  placeholder='Biller name'
                  autoComplete='off'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='company_name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='company-name'>Company Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='company-name'
                  placeholder='Company name'
                  autoComplete='off'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-email'>Email <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='biller-email'
                  placeholder='Email address'
                  autoComplete='off'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='phone_number'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-phone'>Phone Number <span className="text-destructive">*</span></FieldLabel>
                <PhoneInput
                  id='biller-phone'
                  placeholder='Phone number'
                  autoComplete='off'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='vat_number'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='vat-number'>VAT Number</FieldLabel>
              <Input
                id='vat-number'
                placeholder='VAT number'
                autoComplete='off'
                {...field}
                value={field.value || ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <BillerLocationComboboxes form={form} currentRow={currentRow} />

        <Controller
          control={form.control}
          name='address'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='biller-address'>Address <span className="text-destructive">*</span></FieldLabel>
              <Textarea
                id='biller-address'
                placeholder='Full address'
                rows={3}
                className='resize-none'
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='postal_code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='postal-code'>Postal Code</FieldLabel>
                <Input
                  id='postal-code'
                  placeholder='Postal Code'
                  autoComplete='off'
                  {...field}
                  value={field.value || ''}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='biller-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the biller from the system.
                </FieldDescription>
              </div>
              <Switch
                id='biller-active'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}