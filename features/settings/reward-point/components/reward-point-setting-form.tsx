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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import type { RewardPointSettingFormData } from '../schemas'

const DURATION_TYPE_OPTIONS = [
  { value: 'days', label: 'Days' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
] as const

type RewardPointSettingFormProps = {
  form: UseFormReturn<RewardPointSettingFormData>
  onSubmit: (data: RewardPointSettingFormData) => void
  id: string
  isPending?: boolean
}

export function RewardPointSettingForm({
  form,
  onSubmit,
  id,
  isPending = false,
}: RewardPointSettingFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Earn points</CardTitle>
          <p className="text-muted-foreground text-sm">
            Configure how customers earn reward points based on order amount.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FieldLabel htmlFor="is_active">Active reward point</FieldLabel>
                    <FieldDescription>Enable reward points for customers.</FieldDescription>
                  </div>
                  <Switch id="is_active" checked={!!field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="per_point_amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="per_point_amount">Sold amount per point</FieldLabel>
                  <FieldDescription>
                    For example, 100 means for every 100 spent the customer gets 1 point.
                  </FieldDescription>
                  <Input
                    id="per_point_amount"
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

            <Controller
              control={form.control}
              name="minimum_amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="minimum_amount">Minimum sold amount to get point</FieldLabel>
                  <FieldDescription>Customer only gets points if order total reaches this amount.</FieldDescription>
                  <Input
                    id="minimum_amount"
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

            <Controller
              control={form.control}
              name="duration"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="duration">Point expiry duration</FieldLabel>
                  <FieldDescription>Duration after which earned points expire.</FieldDescription>
                  <Input
                    id="duration"
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
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="type">Duration type</FieldLabel>
                  <FieldDescription>Whether the expiry duration is in days, months, or years.</FieldDescription>
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(v) => field.onChange(v === '' ? null : v)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_TYPE_OPTIONS.map((opt) => (
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
          <CardTitle>Redeem points</CardTitle>
          <p className="text-muted-foreground text-sm">
            Configure how customers can redeem reward points.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="redeem_amount_per_unit_rp"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="redeem_amount_per_unit_rp">Redeem amount per unit point</FieldLabel>
                  <FieldDescription>Monetary value each point can be redeemed for.</FieldDescription>
                  <Input
                    id="redeem_amount_per_unit_rp"
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

            <Controller
              control={form.control}
              name="min_order_total_for_redeem"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="min_order_total_for_redeem">Minimum order total to redeem points</FieldLabel>
                  <FieldDescription>Customer can only redeem if order total reaches this amount.</FieldDescription>
                  <Input
                    id="min_order_total_for_redeem"
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

            <Controller
              control={form.control}
              name="min_redeem_point"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="min_redeem_point">Minimum redeem point</FieldLabel>
                  <FieldDescription>Minimum number of points required to redeem.</FieldDescription>
                  <Input
                    id="min_redeem_point"
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
              name="max_redeem_point"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="max_redeem_point">Maximum redeem point per order</FieldLabel>
                  <FieldDescription>Set 0 for unlimited redeem per order.</FieldDescription>
                  <Input
                    id="max_redeem_point"
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
