'use client'

import {
  CancelCircleIcon,
  CloudUploadIcon,
  CodeIcon,
  CopyIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import type { GeneralSettingFormData } from '../schemas'
import type { GeneralSetting } from '../types'

const DATE_FORMAT_OPTIONS = [
  { value: 'd-m-Y', label: 'dd-mm-yyyy' },
  { value: 'd/m/Y', label: 'dd/mm/yyyy' },
  { value: 'd.m.Y', label: 'dd.mm.yyyy' },
  { value: 'm-d-Y', label: 'mm-dd-yyyy' },
  { value: 'm/d/Y', label: 'mm/dd/yyyy' },
  { value: 'm.d.Y', label: 'mm.dd.yyyy' },
  { value: 'Y-m-d', label: 'yyyy-mm-dd' },
  { value: 'Y/m/d', label: 'yyyy/mm/dd' },
  { value: 'Y.m.d', label: 'yyyy.mm.dd' },
]

const STAFF_ACCESS_OPTIONS = [
  { value: 'all', label: 'All Records' },
  { value: 'own', label: 'Own Records' },
  { value: 'warehouse', label: 'Warehouse Wise' },
]

type GeneralSettingFormProps = {
  form: UseFormReturn<GeneralSettingFormData>
  onSubmit: (data: GeneralSettingFormData) => void
  id: string
  isPending?: boolean
  setting?: GeneralSetting | null
}

export function GeneralSettingForm({
  form,
  onSubmit,
  id,
  isPending = false,
  setting,
}: GeneralSettingFormProps) {
  const { resolvedTheme } = useTheme()

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="site_title"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="site_title">
                    System Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="site_title" placeholder="System title" {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="site_logo"
              render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
                const existingImageUrl = setting?.site_logo_url ?? null
                const hasNewImage = value instanceof File || (Array.isArray(value) && value.length > 0)
                return (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>System Logo</FieldLabel>
                    {existingImageUrl && !hasNewImage && (
                      <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                        <div className="relative h-12 w-24 overflow-hidden rounded-md bg-muted">
                          <ImageZoom
                            backdropClassName={cn(
                              resolvedTheme === 'dark'
                                ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                                : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                            )}
                          >
                            <Image
                              src={existingImageUrl}
                              alt="Current logo"
                              width={96}
                              height={48}
                              className="h-full w-full object-contain"
                              unoptimized
                            />
                          </ImageZoom>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Current Logo</p>
                          <p className="text-xs text-muted-foreground">
                            Upload a new image to replace this one
                          </p>
                        </div>
                      </div>
                    )}
                    <FileUpload
                      value={value as File[] | undefined}
                      onValueChange={onChange}
                      accept="image/*"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, message) => {
                        form.setError('site_logo', { message })
                      }}
                    >
                      <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                        <HugeiconsIcon icon={CloudUploadIcon} className="size-4" />
                        Drag and drop or
                        <FileUploadTrigger asChild>
                          <Button variant="link" size="sm" className="p-0">
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
                              <Button variant="ghost" size="icon" className="size-7">
                                <HugeiconsIcon icon={CancelCircleIcon} className="size-4" />
                                <span className="sr-only">Delete</span>
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
              name="favicon"
              render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
                const existingImageUrl = setting?.favicon_url ?? null
                const hasNewImage = value instanceof File || (Array.isArray(value) && value.length > 0)
                return (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Favicon</FieldLabel>
                    {existingImageUrl && !hasNewImage && (
                      <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                        <div className="relative size-8 overflow-hidden rounded-md bg-muted">
                          <ImageZoom
                            backdropClassName={cn(
                              resolvedTheme === 'dark'
                                ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                                : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                            )}
                          >
                            <Image
                              src={existingImageUrl}
                              alt="Current favicon"
                              width={32}
                              height={32}
                              className="size-full object-contain"
                              unoptimized
                            />
                          </ImageZoom>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Current Favicon</p>
                          <p className="text-xs text-muted-foreground">
                            Upload a new image to replace this one
                          </p>
                        </div>
                      </div>
                    )}
                    <FileUpload
                      value={value as File[] | undefined}
                      onValueChange={onChange}
                      accept="image/*"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, message) => {
                        form.setError('favicon', { message })
                      }}
                    >
                      <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                        <HugeiconsIcon icon={CloudUploadIcon} className="size-4" />
                        Drag and drop or
                        <FileUploadTrigger asChild>
                          <Button variant="link" size="sm" className="p-0">
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
                              <Button variant="ghost" size="icon" className="size-7">
                                <HugeiconsIcon icon={CancelCircleIcon} className="size-4" />
                                <span className="sr-only">Delete</span>
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
              name="is_rtl"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_rtl"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="is_rtl" className="font-normal">
                      RTL Layout
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="is_zatca"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_zatca"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="is_zatca" className="font-normal">
                      ZATCA QR Code
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company &amp; Locale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="company_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="company_name">Company Name</FieldLabel>
                  <Input id="company_name" placeholder="Company name" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="vat_registration_number"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="vat_registration_number">VAT Registration Number</FieldLabel>
                  <Input id="vat_registration_number" placeholder="VAT number" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="timezone"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="timezone">Time Zone</FieldLabel>
                  <Input id="timezone" placeholder="e.g. UTC" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="currency"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="currency">Currency</FieldLabel>
                  <Input id="currency" placeholder="Currency code or ID" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="currency_position"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Currency Position</FieldLabel>
                  <RadioGroup
                    value={field.value ?? 'prefix'}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prefix" id="currency_prefix" />
                      <label htmlFor="currency_prefix" className="cursor-pointer text-sm font-medium">
                        Prefix
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suffix" id="currency_suffix" />
                      <label htmlFor="currency_suffix" className="cursor-pointer text-sm font-medium">
                        Suffix
                      </label>
                    </div>
                  </RadioGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="decimal"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="decimal">Digits after decimal point</FieldLabel>
                  <Input
                    id="decimal"
                    type="number"
                    min={0}
                    max={6}
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
              name="date_format"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="date_format">Date Format</FieldLabel>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || null)}
                  >
                    <SelectTrigger id="date_format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMAT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
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
              name="staff_access"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Staff Access</FieldLabel>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange((v as 'all' | 'own' | 'warehouse') || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_ACCESS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales &amp; Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="without_stock"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Sale and Quotation without stock</FieldLabel>
                  <RadioGroup
                    value={field.value ?? 'no'}
                    onValueChange={(v) => field.onChange(v as 'yes' | 'no')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="without_stock_yes" />
                      <label htmlFor="without_stock_yes" className="cursor-pointer text-sm font-medium">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="without_stock_no" />
                      <label htmlFor="without_stock_no" className="cursor-pointer text-sm font-medium">
                        No
                      </label>
                    </div>
                  </RadioGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="is_packing_slip"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_packing_slip"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="is_packing_slip" className="font-normal">
                      Packing slip to manage orders/sales
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="show_products_details_in_sales_table"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="show_products_details_in_sales_table"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="show_products_details_in_sales_table" className="font-normal">
                      Show products details in sales list
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="show_products_details_in_purchase_table"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="show_products_details_in_purchase_table"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="show_products_details_in_purchase_table" className="font-normal">
                      Show products details in purchase list
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="invoice_format"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Invoice Format</FieldLabel>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange((v as 'standard' | 'gst') || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="gst">Indian GST</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="state"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>State (GST)</FieldLabel>
                  <Select
                    value={field.value != null ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Home State</SelectItem>
                      <SelectItem value="2">Buyer State</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="expiry_alert_days"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="expiry_alert_days">Expiry alert (days)</FieldLabel>
                  <FieldDescription>
                    Show alerts for products expiring within this many days
                  </FieldDescription>
                  <Input
                    id="expiry_alert_days"
                    type="number"
                    min={0}
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
              name="developed_by"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="developed_by">Developed By</FieldLabel>
                  <Input id="developed_by" placeholder="Developer name" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="margin_type"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Profit margin type</FieldLabel>
                  <Select
                    value={field.value != null ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(v ? (Number(v) as 0 | 1) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Percentage</SelectItem>
                      <SelectItem value="1">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="default_margin_value"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="default_margin_value">Default profit margin value</FieldLabel>
                  <Input
                    id="default_margin_value"
                    type="number"
                    min={0}
                    step="any"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security &amp; Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="disable_signup"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="disable_signup"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="disable_signup" className="font-normal">
                      Disable registration
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="disable_forgot_password"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="disable_forgot_password"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="disable_forgot_password" className="font-normal">
                      Disable password reset
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="maintenance_allowed_ips"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="maintenance_allowed_ips">Maintenance allowed IPs</FieldLabel>
                  <FieldDescription>
                    Comma-separated IPs allowed when maintenance mode is on. Leave empty to disable.
                  </FieldDescription>
                  <Input
                    id="maintenance_allowed_ips"
                    placeholder="127.0.0.1, 192.168.1.1"
                    {...field}
                    value={field.value ?? ''}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="font_css"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="font_css">Font CSS</FieldLabel>
                  <InputGroup className="h-auto">
                    <InputGroupAddon align="block-start" className="border-b">
                      <InputGroupText className="font-mono font-medium">
                        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                        font.css
                      </InputGroupText>
                      <InputGroupButton
                        size="icon-xs"
                        className="ml-auto"
                        type="button"
                        onClick={() => field.onChange('')}
                      >
                        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                      </InputGroupButton>
                      <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          const v = field.value ?? ''
                          void navigator.clipboard.writeText(v).then(() => toast.success('Copied to clipboard'))
                        }}
                      >
                        <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
                        <span className="sr-only">Copy</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupTextarea
                      id="font_css"
                      rows={4}
                      className="min-h-[300px] resize-none py-3 font-mono text-sm"
                      placeholder="/* Custom font CSS */"
                      {...field}
                      value={field.value ?? ''}
                    />
                    <InputGroupAddon align="block-end" className="border-t">
                      <InputGroupText>Line 1, Column 1</InputGroupText>
                      <InputGroupText className="ml-auto">CSS</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="auth_css"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="auth_css">Auth pages CSS (login, registration, etc.)</FieldLabel>
                  <InputGroup className="h-auto">
                    <InputGroupAddon align="block-start" className="border-b">
                      <InputGroupText className="font-mono font-medium">
                        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                        auth.css
                      </InputGroupText>
                      <InputGroupButton
                        size="icon-xs"
                        className="ml-auto"
                        type="button"
                        onClick={() => field.onChange('')}
                      >
                        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                      </InputGroupButton>
                      <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          const v = field.value ?? ''
                          void navigator.clipboard.writeText(v).then(() => toast.success('Copied to clipboard'))
                        }}
                      >
                        <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
                        <span className="sr-only">Copy</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupTextarea
                      id="auth_css"
                      rows={4}
                      className="min-h-[300px] resize-none py-3 font-mono text-sm"
                      placeholder="/* CSS for auth pages */"
                      {...field}
                      value={field.value ?? ''}
                    />
                    <InputGroupAddon align="block-end" className="border-t">
                      <InputGroupText>Line 1, Column 1</InputGroupText>
                      <InputGroupText className="ml-auto">CSS</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="pos_css"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="pos_css">POS page CSS</FieldLabel>
                  <InputGroup className="h-auto">
                    <InputGroupAddon align="block-start" className="border-b">
                      <InputGroupText className="font-mono font-medium">
                        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                        pos.css
                      </InputGroupText>
                      <InputGroupButton
                        size="icon-xs"
                        className="ml-auto"
                        type="button"
                        onClick={() => field.onChange('')}
                      >
                        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                      </InputGroupButton>
                      <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          const v = field.value ?? ''
                          void navigator.clipboard.writeText(v).then(() => toast.success('Copied to clipboard'))
                        }}
                      >
                        <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
                        <span className="sr-only">Copy</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupTextarea
                      id="pos_css"
                      rows={4}
                      className="min-h-[300px] resize-none py-3 font-mono text-sm"
                      placeholder="/* CSS for POS page */"
                      {...field}
                      value={field.value ?? ''}
                    />
                    <InputGroupAddon align="block-end" className="border-t">
                      <InputGroupText>Line 1, Column 1</InputGroupText>
                      <InputGroupText className="ml-auto">CSS</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="custom_css"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="custom_css">Custom CSS (other pages)</FieldLabel>
                  <InputGroup className="h-auto">
                    <InputGroupAddon align="block-start" className="border-b">
                      <InputGroupText className="font-mono font-medium">
                        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                        custom.css
                      </InputGroupText>
                      <InputGroupButton
                        size="icon-xs"
                        className="ml-auto"
                        type="button"
                        onClick={() => field.onChange('')}
                      >
                        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                      </InputGroupButton>
                      <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          const v = field.value ?? ''
                          void navigator.clipboard.writeText(v).then(() => toast.success('Copied to clipboard'))
                        }}
                      >
                        <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
                        <span className="sr-only">Copy</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupTextarea
                      id="custom_css"
                      rows={4}
                      className="min-h-[300px] resize-none py-3 font-mono text-sm"
                      placeholder="/* Custom CSS */"
                      {...field}
                      value={field.value ?? ''}
                    />
                    <InputGroupAddon align="block-end" className="border-t">
                      <InputGroupText>Line 1, Column 1</InputGroupText>
                      <InputGroupText className="ml-auto">CSS</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" form={id} disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
