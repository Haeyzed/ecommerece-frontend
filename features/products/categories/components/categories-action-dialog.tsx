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
  useCreateCategory,
  useUpdateCategory,
  useParentCategories
} from '@/features/products/categories/api'
import { categorySchema, type CategoryFormData } from '@/features/products/categories/schemas'
import { type Category } from '../types'

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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

import { ImageZoom } from '@/components/ui/image-zoom'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'

type CategoriesActionDialogProps = {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const isLoading = isCreating || isUpdating

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: isEdit
      ? {
        name: currentRow.name,
        slug: currentRow.slug,
        short_description: currentRow.short_description,
        page_title: currentRow.page_title,
        is_active: currentRow.is_active,
        featured: currentRow.featured,
        is_sync_disable: currentRow.is_sync_disable,
        parent_id: currentRow?.parent?.id,
        image: [],
        icon: [],
        woocommerce_category_id: currentRow.woocommerce_category_id,
      }
      : {
        name: '',
        slug: '',
        short_description: '',
        page_title: '',
        is_active: true,
        featured: false,
        is_sync_disable: false,
        parent_id: null,
        image: [],
        icon: [],
        woocommerce_category_id: null,
      },
  })

  const onSubmit = (values: CategoryFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateCategory({ id: currentRow.id, data: values }, options)
    } else {
      createCategory(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the category details here. ' : 'Create a new category here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
            <CategoryForm
              form={form}
              onSubmit={onSubmit}
              id='category-form'
              isEdit={isEdit}
              currentRow={currentRow}
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='category-form' disabled={isLoading}>
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
    <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the category details here. ' : 'Create a new category here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">
          <CategoryForm
            form={form}
            onSubmit={onSubmit}
            id='category-form'
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='category-form' disabled={isLoading}>
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

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>
  onSubmit: (data: CategoryFormData) => void
  id: string
  className?: string
  isEdit: boolean
  currentRow?: Category
}

function CategoryForm({ form, onSubmit, id, className, isEdit, currentRow }: CategoryFormProps) {
  const { resolvedTheme } = useTheme()
  const [isSlugDisabled, setIsSlugDisabled] = useState(true)
  const { data: parentCategories } = useParentCategories()
  const availableParents = parentCategories?.filter((c) => c.value !== currentRow?.id) ?? []

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
              <FieldLabel htmlFor='category-name'>Name <span className="text-destructive">*</span></FieldLabel>
              <Input
                id='category-name'
                placeholder='Category name'
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
              <FieldLabel htmlFor='category-slug'>Slug</FieldLabel>
              <div className='flex gap-2'>
                <Input
                  id='category-slug'
                  placeholder='category-slug'
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
          name='parent_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className="flex flex-col">
              <FieldLabel htmlFor='category-parent-id'>Parent Category</FieldLabel>
              <Combobox
                items={availableParents}
                itemToStringLabel={(item) => item.label}
                value={availableParents.find((p) => p.value === field.value) ?? null}
                onValueChange={(item) => {
                  field.onChange(item?.value ?? null)
                }}
                isItemEqualToValue={(a, b) => a?.value === b?.value}
              >
                <ComboboxInput
                  id="category-parent-id"
                  name="category-parent-id"
                  placeholder="Select parent category..."
                  required
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>No category found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>
                Select a parent category to create a hierarchy.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Short Description */}
        <Controller
          control={form.control}
          name='short_description'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='category-description'>Description</FieldLabel>
              <Textarea
                id='category-description'
                placeholder='Category description'
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
              <FieldLabel htmlFor='category-page-title'>Page Title</FieldLabel>
              <Input
                id='category-page-title'
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
                <FieldLabel htmlFor='category-image'>Image</FieldLabel>

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
                          alt={currentRow?.name || 'Category image'}
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
                    form.setError('image', { message })
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
                          <Button variant='ghost' size='icon' className='size-7'>
                            <HugeiconsIcon icon={CancelCircleIcon} className='size-4' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                <FieldDescription>JPEG, PNG, JPG, GIF, or WebP. Max 5MB.</FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
          name='icon'
          render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
            const existingIconUrl = isEdit && currentRow?.icon_url ? currentRow.icon_url : null
            const hasNewIcon = value instanceof File || (Array.isArray(value) && value.length > 0)

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='category-icon'>Icon</FieldLabel>

                {existingIconUrl && !hasNewIcon && (
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
                          src={existingIconUrl}
                          alt={currentRow?.name || 'Category icon'}
                          width={64}
                          height={64}
                          className='h-full w-full object-cover'
                          unoptimized
                        />
                      </ImageZoom>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Current Icon</p>
                      <p className='text-xs text-muted-foreground'>
                        Upload a new icon to replace this one
                      </p>
                    </div>
                  </div>
                )}

                <FileUpload
                  value={value as File[] | undefined}
                  onValueChange={onChange}
                  accept='image/svg+xml'
                  maxFiles={1}
                  onFileReject={(_, message) => {
                    form.setError('icon', { message })
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
                          <Button variant='ghost' size='icon' className='size-7'>
                            <HugeiconsIcon icon={CancelCircleIcon} className='size-4' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                <FieldDescription>SVG.</FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
          name='woocommerce_category_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='category-woocommerce-category-id'>WooCommerce Category ID</FieldLabel>
              <Input
                id='category-woocommerce-category-id'
                type="number"
                placeholder="WooCommerce ID"
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Switches */}
        <Controller
          control={form.control}
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='category-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the category from public view.
                </FieldDescription>
              </div>
              <Switch
                id='category-active'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='featured'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='category-featured'>Featured Status</FieldLabel>
                <FieldDescription>
                  Enabling this will make the category appear in the featured section.
                </FieldDescription>
              </div>
              <Switch
                id='category-featured'
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='is_sync_disable'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='category-is-sync-disable'>Sync Disable Status</FieldLabel>
                <FieldDescription>
                  Enabling this will disable the category sync with WooCommerce.
                </FieldDescription>
              </div>
              <Switch
                id='category-is-sync-disable'
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