'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { useCreateCustomer, useUpdateCustomer, useCustomerGroupsActive } from '../api'
import { customerSchema, type CustomerFormData } from '../schemas'
import type { Customer } from '../types'
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
import { PasswordInput } from '@/components/password-input'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { PhoneInput } from '@/components/ui/phone-input'
import { Spinner } from '@/components/ui/spinner'
import { useOptionCountries } from '@/features/settings/countries/api'
import { useStatesByCountry } from '@/features/settings/countries/api'
import { useCitiesByState } from '@/features/settings/states/api'

type CustomersActionDialogProps = {
  currentRow?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomersActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer()
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer()
  const isLoading = isCreating || isUpdating

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: isEdit && currentRow
      ? {
          customer_group_id: currentRow.customer_group_id ?? undefined,
          name: currentRow.name ?? '',
          company_name: currentRow.company_name ?? '',
          email: currentRow.email ?? '',
          phone_number: currentRow.phone_number ?? '',
          wa_number: currentRow.wa_number ?? '',
          tax_no: currentRow.tax_no ?? '',
          address: currentRow.address ?? '',
          country_id: currentRow.country_id ?? undefined,
          state_id: currentRow.state_id ?? undefined,
          city_id: currentRow.city_id ?? undefined,
          postal_code: currentRow.postal_code ?? '',
          opening_balance: currentRow.opening_balance ?? 0,
          credit_limit: currentRow.credit_limit ?? undefined,
          deposit: currentRow.deposit ?? undefined,
          pay_term_no: currentRow.pay_term_no ?? undefined,
          pay_term_period: currentRow.pay_term_period ?? '',
          is_active: currentRow.is_active ?? true,
          both: false,
          user: false,
        }
      : {
          customer_group_id: undefined,
          name: '',
          company_name: '',
          email: '',
          phone_number: '',
          wa_number: '',
          tax_no: '',
          address: '',
          country_id: undefined,
          state_id: undefined,
          city_id: undefined,
          postal_code: '',
          opening_balance: 0,
          credit_limit: undefined,
          deposit: undefined,
          pay_term_no: undefined,
          pay_term_period: '',
          is_active: true,
          both: false,
          user: false,
        },
  })

  const onSubmit = (values: CustomerFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateCustomer({ id: currentRow.id, data: values }, options)
    } else {
      createCustomer(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the customer details here. ' : 'Create a new customer here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <CustomerForm
              form={form}
              onSubmit={onSubmit}
              id='customer-form'
              isEdit={isEdit}
              currentRow={currentRow}
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='customer-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Customer' : 'Add New Customer'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the customer details here. ' : 'Create a new customer here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <CustomerForm
            form={form}
            onSubmit={onSubmit}
            id='customer-form'
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='customer-form' disabled={isLoading}>
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

interface CustomerFormProps {
  form: UseFormReturn<CustomerFormData>
  onSubmit: (data: CustomerFormData) => void
  id: string
  className?: string
  isEdit: boolean
  currentRow?: Customer
}

function CustomerForm({ form, onSubmit, id, className, isEdit, currentRow }: CustomerFormProps) {
  const countryId = form.watch('country_id')
  const stateId = form.watch('state_id')
  const user = form.watch('user')

  const { data: customerGroups = [] } = useCustomerGroupsActive()
  const { data: optionCountries } = useOptionCountries()
  const { data: statesData } = useStatesByCountry(countryId ?? null)
  const { data: citiesData } = useCitiesByState(stateId ?? null)

  const groupOptions = customerGroups.map((g) => ({ value: g.id, label: g.name }))
  const countryOptions = Array.isArray(optionCountries) ? optionCountries : []
  const stateOptions = Array.isArray(statesData) ? statesData : []
  const cityOptions = Array.isArray(citiesData) ? citiesData : []

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='customer_group_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-col'>
              <FieldLabel htmlFor='customer-group'>Customer group <span className="text-destructive">*</span></FieldLabel>
              <Combobox
                items={groupOptions}
                itemToStringLabel={(item) => item.label}
                value={groupOptions.find((p) => p.value === field.value) ?? null}
                onValueChange={(item) => field.onChange(item?.value ?? undefined)}
                isItemEqualToValue={(a, b) => a?.value === b?.value}
              >
                <ComboboxInput id='customer-group' name='customer-group' placeholder='Select customer group...' showClear />
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

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-name'>Name <span className="text-destructive">*</span></FieldLabel>
                <Input id='customer-name' placeholder='Customer name' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='company_name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-company'>Company name</FieldLabel>
                <Input id='customer-company' placeholder='Company' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-email'>Email</FieldLabel>
                <Input id='customer-email' type='email' placeholder='email@example.com' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='phone_number'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-phone'>Phone</FieldLabel>
                <PhoneInput id='customer-phone' placeholder='Phone number' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='wa_number'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='customer-wa'>WhatsApp number</FieldLabel>
              <PhoneInput id='customer-wa' placeholder='WhatsApp' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='tax_no'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='customer-tax'>Tax number</FieldLabel>
              <Input id='customer-tax' placeholder='Tax no' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='country_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-col'>
              <FieldLabel htmlFor='customer-country'>Country</FieldLabel>
              <Combobox
                items={countryOptions}
                itemToStringLabel={(item) => item.label}
                value={countryOptions.find((p) => p.value === field.value) ?? null}
                onValueChange={(item) => {
                  field.onChange(item?.value ?? null)
                  form.setValue('state_id', undefined)
                  form.setValue('city_id', undefined)
                }}
                isItemEqualToValue={(a, b) => a?.value === b?.value}
              >
                <ComboboxInput id='customer-country' name='customer-country' placeholder='Select country...' showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No country found.</ComboboxEmpty>
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
          name='state_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-col'>
              <FieldLabel htmlFor='customer-state'>State</FieldLabel>
              <Combobox
                items={stateOptions}
                itemToStringLabel={(item) => item.label}
                value={stateOptions.find((p) => p.value === field.value) ?? null}
                onValueChange={(item) => {
                  field.onChange(item?.value ?? null)
                  form.setValue('city_id', undefined)
                }}
                isItemEqualToValue={(a, b) => a?.value === b?.value}
              >
                <ComboboxInput id='customer-state' name='customer-state' placeholder='Select state...' showClear disabled={!countryId} />
                <ComboboxContent>
                  <ComboboxEmpty>No state found.</ComboboxEmpty>
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
          name='city_id'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-col'>
              <FieldLabel htmlFor='customer-city'>City</FieldLabel>
              <Combobox
                items={cityOptions}
                itemToStringLabel={(item) => item.label}
                value={cityOptions.find((p) => p.value === field.value) ?? null}
                onValueChange={(item) => field.onChange(item?.value ?? null)}
                isItemEqualToValue={(a, b) => a?.value === b?.value}
              >
                <ComboboxInput id='customer-city' name='customer-city' placeholder='Select city...' showClear disabled={!stateId} />
                <ComboboxContent>
                  <ComboboxEmpty>No city found.</ComboboxEmpty>
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
          name='address'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='customer-address'>Address</FieldLabel>
              <Input id='customer-address' placeholder='Street address' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='postal_code'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='customer-postal'>Postal code</FieldLabel>
              <Input id='customer-postal' placeholder='Postal code' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='opening_balance'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-opening'>Opening balance</FieldLabel>
                <Input
                  id='customer-opening'
                  type='number'
                  step='0.01'
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
            name='credit_limit'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-credit'>Credit limit</FieldLabel>
                <Input
                  id='customer-credit'
                  type='number'
                  step='0.01'
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='pay_term_no'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-pay-term-no'>Pay term (number)</FieldLabel>
                <Input
                  id='customer-pay-term-no'
                  type='number'
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
            name='pay_term_period'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='customer-pay-term-period'>Pay term period</FieldLabel>
                <Input id='customer-pay-term-period' placeholder='e.g. days' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='deposit'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='customer-deposit'>Deposit</FieldLabel>
              <Input
                id='customer-deposit'
                type='number'
                step='0.01'
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
          name='is_active'
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className='flex flex-row items-center justify-between rounded-md border p-4'
            >
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='customer-active'>Active Status</FieldLabel>
                <span className='text-xs text-muted-foreground'>Disabling this will hide the customer from the system.</span>
              </div>
              <Switch id='customer-active' checked={!!field.value} onCheckedChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='both'
          render={({ field }) => (
            <Field className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='customer-both'>Also register as supplier</FieldLabel>
                <FieldDescription>
                  Create a supplier record for this contact so they can be used for purchases.
                </FieldDescription>
              </div>
              <Switch id='customer-both' checked={!!field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='user'
          render={({ field }) => (
            <Field className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='customer-user'>Create portal login</FieldLabel>
                <FieldDescription>
                  Allow this customer to sign in with a username and password to access their account.
                </FieldDescription>
              </div>
              <Switch id='customer-user' checked={!!field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />

        {user && (
          <>
            <Controller
              control={form.control}
              name='username'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor='customer-username'>Username <span className="text-destructive">*</span></FieldLabel>
                  <Input id='customer-username' placeholder='Username' autoComplete='off' {...field} value={field.value ?? ''} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='password'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor='customer-password'>{isEdit ? 'New password (leave blank to keep)' : 'Password *'}</FieldLabel>
                  <PasswordInput
                    id='customer-password'
                    placeholder={isEdit ? 'Leave blank to keep current' : 'Min 8 characters'}
                    autoComplete='off'
                    {...field}
                    value={field.value ?? ''}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </>
        )}
      </FieldGroup>
    </form>
  )
}
