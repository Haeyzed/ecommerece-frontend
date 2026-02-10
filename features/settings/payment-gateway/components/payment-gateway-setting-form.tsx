'use client'

import * as React from 'react'
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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import type { PaymentGateway } from '../types'
import { PAYMENT_MODULE_OPTIONS } from '../types'
import type { PaymentGatewayUpdateData } from '../schemas'

const MODULE_ITEMS = ['pos', 'ecommerce'] as const
const MASKED = '********'

function moduleStatusToArray(ms: PaymentGateway['module_status']): string[] {
  if (!ms || typeof ms !== 'object') return []
  return (Object.entries(ms) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k)
}

function arrayToModuleStatus(arr: string[]): { pos: boolean; ecommerce: boolean } {
  return {
    pos: arr.includes('pos'),
    ecommerce: arr.includes('ecommerce'),
  }
}

type PaymentGatewaySettingFormProps = {
  gateway: PaymentGateway
  onSubmit: (id: number, data: PaymentGatewayUpdateData) => void
  isPending?: boolean
}

export function PaymentGatewaySettingForm({
  gateway,
  onSubmit,
  isPending = false,
}: PaymentGatewaySettingFormProps) {
  const anchor = useComboboxAnchor()
  const detailKeys = Object.keys(gateway.details ?? {})

  const form = useForm({
    defaultValues: {
      details: { ...(gateway.details ?? {}) },
      active: !!gateway.active,
      module_status: moduleStatusToArray(gateway.module_status ?? {}),
    },
  })

  React.useEffect(() => {
    form.reset({
      details: { ...(gateway.details ?? {}) },
      active: !!gateway.active,
      module_status: moduleStatusToArray(gateway.module_status ?? {}),
    })
  }, [gateway, form])

  const details = form.watch('details') ?? {}
  const setDetail = (key: string, value: string) => {
    form.setValue('details', { ...details, [key]: value ?? '' })
  }

  const handleSubmit = form.handleSubmit((data) => {
    const detailsClean: Record<string, string> = {}
    for (const [k, v] of Object.entries(data.details ?? {})) {
      if (v != null && v !== '' && v !== MASKED) detailsClean[k] = String(v)
    }
    onSubmit(gateway.id, {
      details: Object.keys(detailsClean).length ? detailsClean : undefined,
      active: data.active,
      module_status: arrayToModuleStatus(data.module_status),
    })
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>{gateway.name} Details</CardTitle>
            <p className="text-muted-foreground text-sm">
              Configure credentials and which modules use this gateway.
            </p>
          </div>
          <div className="w-[200px]">
            <Controller
              control={form.control}
              name="module_status"
              render={({ field }) => (
                <Combobox
                  multiple
                  autoHighlight
                  items={MODULE_ITEMS}
                  value={field.value}
                  onValueChange={(v) => field.onChange(Array.isArray(v) ? v : [])}
                >
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values: string[]) => (
                        <>
                          {values.map((v) => (
                            <ComboboxChip key={v}>
                              {PAYMENT_MODULE_OPTIONS.find((o) => o.value === v)?.label ?? v}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Modules" />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No modules.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          {PAYMENT_MODULE_OPTIONS.find((o) => o.value === item)?.label ?? item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            {detailKeys.map((key) => (
              <Field key={key}>
                <FieldLabel htmlFor={`pg-${gateway.id}-${key}`}>{key}</FieldLabel>
                {key.toLowerCase() === 'mode' ? (
                  <Select
                    value={(details[key] ?? '').toLowerCase() === 'live' ? 'live' : 'sandbox'}
                    onValueChange={(v) => setDetail(key, v)}
                  >
                    <SelectTrigger id={`pg-${gateway.id}-${key}`}>
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`pg-${gateway.id}-${key}`}
                    type="text"
                    value={details[key] ?? ''}
                    onChange={(e) => setDetail(key, e.target.value)}
                    placeholder={details[key] === MASKED ? 'Leave blank to keep current' : ''}
                    autoComplete="off"
                  />
                )}
              </Field>
            ))}

            <Controller
              control={form.control}
              name="active"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FieldLabel htmlFor={`pg-active-${gateway.id}`}>Active</FieldLabel>
                    <FieldDescription>
                      Enable this payment gateway for use.
                    </FieldDescription>
                  </div>
                  <Switch
                    id={`pg-active-${gateway.id}`}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardContent className="pt-0">
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
        </CardContent>
      </Card>
    </form>
  )
}
