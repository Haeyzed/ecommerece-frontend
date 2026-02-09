'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import Image from 'next/image'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>System Logo</FieldLabel>
                  <FieldDescription>jpg, jpeg, png, gif (max 5MB)</FieldDescription>
                  {setting?.site_logo_url && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="relative h-12 w-24 overflow-hidden rounded border bg-muted">
                        <Image
                          src={setting.site_logo_url}
                          alt="Current logo"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">Current logo</span>
                    </div>
                  )}
                  <FileUpload
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    accept="image/jpeg,image/png,image/gif"
                  >
                    <FileUploadDropzone />
                    <FileUploadList>
                      {(field.value ?? []).map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete />
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                    <FileUploadTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Choose file
                      </Button>
                    </FileUploadTrigger>
                  </FileUpload>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="favicon"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Favicon</FieldLabel>
                  <FieldDescription>jpg, jpeg, png, gif (max 5MB)</FieldDescription>
                  {setting?.favicon_url && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="relative size-8 overflow-hidden rounded border bg-muted">
                        <Image
                          src={setting.favicon_url}
                          alt="Current favicon"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">Current favicon</span>
                    </div>
                  )}
                  <FileUpload
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    accept="image/jpeg,image/png,image/gif"
                  >
                    <FileUploadDropzone />
                    <FileUploadList>
                      {(field.value ?? []).map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete />
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                    <FileUploadTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Choose file
                      </Button>
                    </FileUploadTrigger>
                  </FileUpload>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
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
                  <Textarea
                    id="font_css"
                    rows={4}
                    className="resize-none font-mono text-sm"
                    placeholder="Custom font CSS"
                    {...field}
                    value={field.value ?? ''}
                  />
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
                  <Textarea
                    id="auth_css"
                    rows={4}
                    className="resize-none font-mono text-sm"
                    placeholder="CSS for auth pages"
                    {...field}
                    value={field.value ?? ''}
                  />
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
                  <Textarea
                    id="pos_css"
                    rows={4}
                    className="resize-none font-mono text-sm"
                    placeholder="CSS for POS page"
                    {...field}
                    value={field.value ?? ''}
                  />
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
                  <Textarea
                    id="custom_css"
                    rows={4}
                    className="resize-none font-mono text-sm"
                    placeholder="Custom CSS"
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
