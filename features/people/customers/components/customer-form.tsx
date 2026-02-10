'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import type { CustomerFormData } from '../schemas'
import type { Customer } from '../types'
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {PhoneInupt} from '@/components/ui/phone-input'

type CustomerFormProps = {
  form: UseFormReturn<CustomerFormData>
  onSubmit: (data: CustomerFormData) => void
  id: string
  isPending?: boolean
  customer?: Customer | null
  customerGroups: { id: number; name: string }[]
  isEdit?: boolean
}

export function CustomerForm({
  form,
  onSubmit,
  id,
  isPending = false,
  customerGroups,
  isEdit = false,
}: CustomerFormProps) {
  const both = form.watch('both')
  const user = form.watch('user')
  const groupOptions = customerGroups.map((g) => ({ value: g.id, label: g.name }))

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
              name="customer_group_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} className="flex flex-col">
                  <FieldLabel>Customer group *</FieldLabel>
                  <Combobox
                    items={groupOptions}
                    itemToStringLabel={(item) => item.label}
                    value={groupOptions.find((p) => p.value === field.value) ?? null}
                    onValueChange={(item) => {
                      field.onChange(item?.value ?? undefined)
                    }}
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput
                      id="customer-group-id"
                      name="customer-group-id"
                      placeholder="Select customer group..."
                      required
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No customer group found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Name *</FieldLabel>
                  <Input {...field} placeholder="Customer name" />
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
                  <PhoneInput {...field} value={field.value ?? ''} placeholder="WhatsApp" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="tax_no"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Tax number</FieldLabel>
                  <Input {...field} value={field.value ?? ''} placeholder="Tax no" />
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
                <Field data-invalid={!!fieldState.error}>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={form.control}
              name="opening_balance"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Opening balance</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
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
              name="credit_limit"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Credit limit</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
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
              name="deposit"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Deposit</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
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
              name="pay_term_no"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Pay term (number)</FieldLabel>
                  <Input
                    type="number"
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

      <Card>
        <CardHeader>
          <CardTitle>Optional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={form.control}
              name="both"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Also add as supplier</FieldLabel>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="user"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Create login user</FieldLabel>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
            {user && (
              <>
                <Controller
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Username *</FieldLabel>
                      <Input {...field} value={field.value ?? ''} placeholder="Username" />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>{isEdit ? 'New password (leave blank to keep)' : 'Password *'}</FieldLabel>
                      <Input
                        type="password"
                        {...field}
                        value={field.value ?? ''}
                        placeholder={isEdit ? 'Leave blank to keep current' : 'Min 8 characters'}
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" form={id} disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update customer' : 'Create customer'}
        </Button>
      </div>
    </form>
  )
}
