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
  useCreateBrand,
  useUpdateBrand
} from '@/features/products/brands/api'
import { brandSchema, type BrandFormData } from '@/features/products/brands/schemas'
import { type Brand } from '../types'

import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
import { generateSlug } from '@/lib/slug'
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

type BrandActionDialogProps = {
  currentRow?: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: BrandActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand()
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand()
  const isLoading = isCreating || isUpdating

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: isEdit
      ? {
        name: currentRow.name,
        slug: currentRow.slug,
        short_description: currentRow.short_description,
        page_title: currentRow.page_title,
        is_active: currentRow.is_active,
        image: [],
      }
      : {
        name: '',
        slug: '',
        short_description: '',
        page_title: '',
        is_active: true,
        image: [],
      },
  })

  const onSubmit = (values: BrandFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateBrand({ id: currentRow.id, data: values }, options)
    } else {
      createBrand(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the brand details here. ' : 'Create a new brand here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <BrandForm
              form={form}
              onSubmit={onSubmit}
              id='brand-form'
              isEdit={isEdit}
              currentRow={currentRow}
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='brand-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Brand' : 'Add New Brand'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the brand details here. ' : 'Create a new brand here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <BrandForm
            form={form}
            onSubmit={onSubmit}
            id='brand-form'
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='brand-form' disabled={isLoading}>
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

interface BrandFormProps {
  form: UseFormReturn<BrandFormData>
  onSubmit: (data: BrandFormData) => void
  id: string
  className?: string
  isEdit: boolean
  currentRow?: Brand
}

function BrandForm({ form, onSubmit, id, className, isEdit, currentRow }: BrandFormProps) {
  const { resolvedTheme } = useTheme()
  const [isSlugDisabled, setIsSlugDisabled] = useState(true)

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
              <FieldLabel htmlFor='brand-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='brand-name'
                placeholder='Brand name'
                autoComplete='off'
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  if (isSlugDisabled) {
                    form.setValue('slug', generateSlug(e.target.value), { shouldValidate: true })
                  }
                }}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='slug'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='brand-slug'>Slug</FieldLabel>
              <div className='flex gap-2'>
                <Input
                  id='brand-slug'
                  placeholder='brand-slug'
                  autoComplete='off'
                  {...field}
                  value={field.value || ''}
                  disabled={isSlugDisabled}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                  onClick={() => setIsSlugDisabled((prev) => !prev)}
                  title={isSlugDisabled ? "Enable editing" : "Disable editing"}
                >
                  <HugeiconsIcon icon={Edit01Icon} className='size-4' />
                </Button>
              </div>
              <FieldDescription>
                URL-friendly version of the name (auto-generated)
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='short_description'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='brand-description'>Description</FieldLabel>
              <Textarea
                id='brand-description'
                placeholder='Brand description'
                rows={3}
                className='resize-none'
                {...field}
                value={field.value || ''}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='page_title'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='brand-page-title'>Page Title</FieldLabel>
              <Input
                id='brand-page-title'
                placeholder='SEO Page Title'
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
          name='image'
          render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
            const existingImageUrl = isEdit && currentRow?.image_url ? currentRow.image_url : null
            const hasNewImage = value instanceof File || (Array.isArray(value) && value.length > 0)

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='brand-image'>Image</FieldLabel>

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
                          alt={currentRow?.name || 'Brand image'}
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

        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='brand-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the brand from public view.
                </FieldDescription>
              </div>
              <Switch
                id='brand-active'
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