'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateDocumentType,
  useUpdateDocumentType
} from '@/features/hrm/document-types/api'
import { documentTypeSchema, type DocumentTypeFormData } from '@/features/hrm/document-types/schemas'
import { type DocumentType } from '../types'

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

type DocumentTypesActionDialogProps = {
  currentRow?: DocumentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentTypesActionDialog({
                                         currentRow,
                                         open,
                                         onOpenChange,
                                       }: DocumentTypesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createDocumentType, isPending: isCreating } = useCreateDocumentType()
  const { mutate: updateDocumentType, isPending: isUpdating } = useUpdateDocumentType()
  const isLoading = isCreating || isUpdating

  const form = useForm<DocumentTypeFormData>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: isEdit && currentRow
        ? {
          name: currentRow.name,
          code: currentRow.code,
          requires_expiry: currentRow.requires_expiry,
          is_active: currentRow.is_active,
        }
        : {
          name: '',
          code: '',
          requires_expiry: false,
          is_active: true,
        },
  })

  const onSubmit = (values: DocumentTypeFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateDocumentType({ id: currentRow.id, data: values }, options)
    } else {
      createDocumentType(values, options)
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
              <DialogTitle>{isEdit ? 'Edit Document Type' : 'Add New Document Type'}</DialogTitle>
              <DialogDescription>
                {isEdit ? 'Update the document type details here. ' : 'Create a new document type here. '}
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
              <DocumentTypeForm form={form} onSubmit={onSubmit} id='document-type-form' />
            </div>

            <DialogFooter>
              <Button type='submit' form='document-type-form' disabled={isLoading}>
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
            <DrawerTitle>{isEdit ? 'Edit Document Type' : 'Add New Document Type'}</DrawerTitle>
            <DrawerDescription>
              {isEdit ? 'Update the document type details here. ' : 'Create a new document type here. '}
              Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>

          <div className='no-scrollbar overflow-y-auto px-4'>
            <DocumentTypeForm form={form} onSubmit={onSubmit} id='document-type-form' />
          </div>

          <DrawerFooter>
            <Button type='submit' form='document-type-form' disabled={isLoading}>
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

interface DocumentTypeFormProps {
  form: UseFormReturn<DocumentTypeFormData>
  onSubmit: (data: DocumentTypeFormData) => void
  id: string
  className?: string
}

function DocumentTypeForm({ form, onSubmit, id, className }: DocumentTypeFormProps) {
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
                    <FieldLabel htmlFor='document-type-name'>Name <span className="text-destructive">*</span></FieldLabel>
                    <Input
                        id='document-type-name'
                        placeholder='e.g. National Identity Card'
                        autoComplete='off'
                        {...field}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
              )}
          />

            <Controller
                control={form.control}
                name='code'
                render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor='code'>Code <span className="text-destructive">*</span></FieldLabel>
                      <Input
                          id='code'
                          placeholder='e.g. NIN'
                          autoComplete='off'
                          {...field}
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                control={form.control}
                name='requires_expiry'
                render={({ field, fieldState }) => (
                    <Field
                        data-invalid={!!fieldState.error}
                        className='flex flex-row items-center justify-between rounded-md border p-4'
                    >
                        <div className='space-y-0.5'>
                            <FieldLabel htmlFor='document-type-requires-expiry'>Requires Expiry</FieldLabel>
                            <FieldDescription>
                                If enabled, an expiry date will be mandatory for documents of this type.
                            </FieldDescription>
                        </div>
                        <Switch
                            id='document-type-requires-expiry'
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
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
                      <FieldLabel htmlFor='document-type-active'>Active Status</FieldLabel>
                      <FieldDescription>
                        Disabling this will hide the document type from the system.
                      </FieldDescription>
                    </div>
                    <Switch
                        id='document-type-active'
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