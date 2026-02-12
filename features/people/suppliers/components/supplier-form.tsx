'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import type { SupplierFormData, Supplier } from '../schemas'
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

type SupplierFormProps = {
  form: UseFormReturn<SupplierFormData>
  onSubmit: (data: SupplierFormData) => void
  id: string
  isPending?: boolean
  supplier?: Supplier | null
  isEdit?: boolean
}

export function SupplierForm({
  form,
  onSubmit,
  id,
  isPending = false,
  supplier,
  isEdit = false,
}: SupplierFormProps) {
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
                  <Input {...field} placeholder="Supplier name" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="company_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Company name</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="Company" />
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
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    {...field}
                    value={field.value ?? ''}
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
                  <FieldLabel>Phone</FieldLabel>
                  <PhoneInput {...field} value={field.value ?? ''} placeholder="Phone number" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="wa_number"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>WhatsApp number</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="WhatsApp" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="opening_balance"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Opening balance</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    min={0}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    placeholder="0"
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="pay_term_no"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Pay term (number)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 30"
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="pay_term_period"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Pay term period</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="e.g. days" />
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
                  {supplier?.image_url && !value?.length && (
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
                  <FieldLabel>Address</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="Street address" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>City</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="City" />
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
          {isPending ? 'Saving...' : isEdit ? 'Update supplier' : 'Create supplier'}
        </Button>
      </div>
    </form>
  )
}
