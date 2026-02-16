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
        city: currentRow.city,
        state: currentRow.state || '',
        postal_code: currentRow.postal_code || '',
        country: currentRow.country || '',
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
        city: '',
        state: '',
        postal_code: '',
        country: '',
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
      <Dialog open={open} onOpenChange={handleOpenChange}>
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

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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

          <Controller
            control={form.control}
            name='city'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-city'>City <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='biller-city'
                  placeholder='City'
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

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Controller
            control={form.control}
            name='state'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-state'>State</FieldLabel>
                <Input
                  id='biller-state'
                  placeholder='State'
                  autoComplete='off'
                  {...field}
                  value={field.value || ''}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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

          <Controller
            control={form.control}
            name='country'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='biller-country'>Country</FieldLabel>
                <Input
                  id='biller-country'
                  placeholder='Country'
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