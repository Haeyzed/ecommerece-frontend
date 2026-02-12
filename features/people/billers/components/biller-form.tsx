'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import type { BillerFormData } from '../schemas'
import type { Biller } from '../schemas'
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { PhoneInput } from '@/components/ui/phone-input'
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
import { CloudUploadIcon, CancelCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

type BillerFormProps = {
  form: UseFormReturn<BillerFormData>
  onSubmit: (data: BillerFormData) => void
  id: string
  isPending?: boolean
  biller?: Biller | null
  isEdit?: boolean
}

export function BillerForm({
  form,
  onSubmit,
  id,
  isPending = false,
  biller,
  isEdit = false,
}: BillerFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Name *</FieldLabel>
                  <Input {...field} placeholder="Biller name" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="company_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Company name *</FieldLabel>
                  <Input {...field} placeholder="Company" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="vat_number"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>VAT number</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="VAT number" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Email *</FieldLabel>
                  <Input
                    type="email"
                    {...field}
                    placeholder="email@example.com"
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phone_number"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Phone *</FieldLabel>
                  <PhoneInput {...field} value={field.value ?? ''} placeholder="Phone number" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="image"
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={!!fieldState.error} className="md:col-span-2">
                  <FieldLabel>Logo / Image</FieldLabel>
                  <FileUpload
                    value={value ?? []}
                    onValueChange={onChange}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    onFileReject={(_, msg) => form.setError('image', { message: msg })}
                  >
                    <FileUploadDropzone className="flex-col items-center justify-center gap-2 border-dashed p-6 text-center">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={CloudUploadIcon} className="size-5" />
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        <br />
                        <span className="text-muted-foreground">JPG, PNG, GIF, WebP (max 5MB)</span>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button variant="link" size="sm" className="sr-only">
                          Select file
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>
                    <FileUploadList>
                      {(value ?? []).map((file, i) => (
                        <FileUploadItem key={i} value={file} className="w-full">
                          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <span className="text-xs font-medium">IMG</span>
                          </div>
                          <FileUploadItemPreview className="hidden" />
                          <FileUploadItemMetadata className="ml-2 flex-1" />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive"
                            >
                              <HugeiconsIcon icon={CancelCircleIcon} className="size-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                  {biller?.image_url && !value?.length && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Current image on file. Upload a new one to replace.
                    </p>
                  )}
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} className="md:col-span-2">
                  <FieldLabel>Address *</FieldLabel>
                  <Input {...field} placeholder="Street address" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>City *</FieldLabel>
                  <Input {...field} placeholder="City" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="state"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>State / Region</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="State" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="postal_code"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Postal code</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="Postal code" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Country</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="Country" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Active</FieldLabel>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" form={id} disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update biller' : 'Create biller'}
        </Button>
      </div>
    </form>
  )
}
