'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import type { MailSettingFormData } from '../schemas'

type MailSettingFormProps = {
  form: UseFormReturn<MailSettingFormData>
  onSubmit: (data: MailSettingFormData) => void
  id: string
  isPending?: boolean
}

export function MailSettingForm({
  form,
  onSubmit,
  id,
  isPending = false,
}: MailSettingFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <p className="text-muted-foreground text-sm">
            Configure mail driver, host, and credentials. Fields marked with * are required.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="driver"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="driver">
                    Mail Driver <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="driver" placeholder="e.g. smtp" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="host"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="host">
                    Mail Host <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="host" placeholder="e.g. smtp.example.com" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="port"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="port">
                    Mail Port <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="port" placeholder="e.g. 587" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="from_address"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="from_address">
                    From Address <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="from_address" type="email" placeholder="noreply@example.com" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="from_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="from_name">
                    From Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="from_name" placeholder="Your App Name" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="username" placeholder="SMTP username" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    autoComplete="new-password"
                    {...field}
                    value={field.value ?? ''}
                  />
                  <FieldDescription>Leave blank to keep the existing password.</FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="encryption"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="encryption">
                    Encryption <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input id="encryption" placeholder="e.g. tls, ssl, or empty" {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="send_test"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FieldLabel htmlFor="send_test">Send test email after saving</FieldLabel>
                    <FieldDescription>
                      A test email will be sent to the From Address after updating settings.
                    </FieldDescription>
                  </div>
                  <Switch id="send_test" checked={!!field.value} onCheckedChange={field.onChange} />
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
