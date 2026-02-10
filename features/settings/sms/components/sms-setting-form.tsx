'use client'

import { Controller, useForm } from 'react-hook-form'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { SMS_GATEWAY_FIELDS } from '../types'
import type { SmsProvider } from '../types'
import type { SmsSettingUpdateData } from '../schemas'

type SmsSettingFormProps = {
  providers: SmsProvider[]
  selectedProvider: SmsProvider | null
  onSelectProvider: (id: number | null) => void
  onSubmit: (id: number, data: SmsSettingUpdateData) => void
  isPending?: boolean
}

export function SmsSettingForm({
  providers,
  selectedProvider,
  onSelectProvider,
  onSubmit,
  isPending = false,
}: SmsSettingFormProps) {
  const form = useForm<SmsSettingUpdateData & { details: Record<string, string> }>({
    defaultValues: {
      details: {},
      active: false,
    },
  })

  const details = form.watch('details') ?? {}
  const setDetail = (key: string, value: string) => {
    form.setValue('details', { ...details, [key]: value || '' })
  }

  const handleSelect = (value: string) => {
    const id = value ? Number(value) : null
    onSelectProvider(id)
    const provider = id ? providers.find((p) => p.id === id) : null
    if (provider) {
      const details = provider.details ?? {}
      const detailsStrings: Record<string, string> = {}
      for (const [k, v] of Object.entries(details)) {
        detailsStrings[k] = typeof v === 'string' ? v : ''
      }
      form.reset({
        details: detailsStrings,
        active: !!provider.active,
      })
    } else {
      form.reset({ details: {}, active: false })
    }
  }

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedProvider) return
    const detailsClean: Record<string, string> = {}
    const fields = SMS_GATEWAY_FIELDS[selectedProvider.name]
    const MASKED = '********'
    if (fields) {
      for (const { key } of fields) {
        const v = data.details?.[key]
        if (v != null && v !== '' && v !== MASKED) detailsClean[key] = v
      }
    }
    onSubmit(selectedProvider.id, { details: detailsClean, active: data.active })
  })

  const gatewayFields = selectedProvider ? SMS_GATEWAY_FIELDS[selectedProvider.name] : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SMS Gateway</CardTitle>
          <p className="text-muted-foreground text-sm">
            Select a gateway and enter credentials. Set one as default to send SMS.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Gateway</FieldLabel>
              <Select
                value={selectedProvider ? String(selectedProvider.id) : undefined}
                onValueChange={handleSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SMS gateway" />
                </SelectTrigger>
                <SelectContent>
                  {providers.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground text-sm">
                      No SMS gateways configured
                    </div>
                  ) : (
                    providers.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                        {p.active ? ' (Default)' : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </Field>

            {gatewayFields && selectedProvider && (
              <>
                {gatewayFields.map(({ key, label, type = 'text' }) => (
                  <Field key={key}>
                    <FieldLabel htmlFor={`sms-${key}`}>{label}</FieldLabel>
                    <Input
                      id={`sms-${key}`}
                      type={type}
                      placeholder={type === 'password' ? 'Leave blank to keep current' : ''}
                      value={details[key] ?? ''}
                      onChange={(e) => setDetail(key, e.target.value)}
                      autoComplete="off"
                    />
                  </Field>
                ))}

                <Controller
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <Field className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FieldLabel htmlFor="sms-active">Set as default</FieldLabel>
                        <FieldDescription>
                          When enabled, this gateway will be used to send SMS.
                        </FieldDescription>
                      </div>
                      <Switch id="sms-active" checked={!!field.value} onCheckedChange={field.onChange} />
                    </Field>
                  )}
                />
              </>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {selectedProvider && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
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
      )}
    </form>
  )
}
