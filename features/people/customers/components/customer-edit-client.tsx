'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useCustomer, useUpdateCustomer, useCustomerGroupsActive } from '../api'
import { customerSchema, type CustomerFormData } from '../schemas'
import { CustomerForm } from './customer-form'

type CustomerEditClientProps = {
  id: string
}

export function CustomerEditClient({ id }: CustomerEditClientProps) {
  const router = useRouter()
  const customerId = Number(id)
  const { data: customer, isLoading: customerLoading } = useCustomer(customerId)
  const { data: groups = [], isLoading: groupsLoading } = useCustomerGroupsActive()
  const { mutate: updateCustomer, isPending } = useUpdateCustomer()

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customer_group_id: null,
      name: '',
      company_name: null,
      email: null,
      type: null,
      phone_number: null,
      wa_number: null,
      tax_no: null,
      address: null,
      city: null,
      state: null,
      postal_code: null,
      country: null,
      opening_balance: null,
      credit_limit: null,
      deposit: null,
      pay_term_no: null,
      pay_term_period: null,
      is_active: true,
      both: false,
      user: false,
      username: null,
      password: null,
    },
  })

  useEffect(() => {
    if (!customer) return
    form.reset({
      customer_group_id: customer.customer_group_id ?? null,
      name: customer.name ?? '',
      company_name: customer.company_name ?? null,
      email: customer.email ?? null,
      type: customer.type ?? null,
      phone_number: customer.phone_number ?? null,
      wa_number: customer.wa_number ?? null,
      tax_no: customer.tax_no ?? null,
      address: customer.address ?? null,
      city: customer.city ?? null,
      state: customer.state ?? null,
      postal_code: customer.postal_code ?? null,
      country: customer.country ?? null,
      opening_balance: customer.opening_balance ?? null,
      credit_limit: customer.credit_limit ?? null,
      deposit: customer.deposit ?? null,
      pay_term_no: customer.pay_term_no ?? null,
      pay_term_period: customer.pay_term_period ?? null,
      is_active: customer.is_active ?? true,
      both: false,
      user: false,
      username: null,
      password: null,
    })
  }, [customer, form])

  const onSubmit = (data: CustomerFormData) => {
    const payload = { ...data }
    if (!payload.email) payload.email = null
    if (!payload.password?.trim()) delete (payload as Partial<CustomerFormData>).password
    updateCustomer(
      { id: customerId, data: payload },
      {
        onSuccess: () => {
          router.push(`/people/customers/${customerId}`)
        },
      }
    )
  }

  const isLoading = customerLoading || groupsLoading

  if (isLoading && !customer) {
    return (
      <AuthenticatedLayout>
        <Header fixed>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className="flex flex-1 items-center justify-center">
          <Spinner className="size-8" />
        </Main>
      </AuthenticatedLayout>
    )
  }

  if (!customer) {
    return (
      <AuthenticatedLayout>
        <Header fixed>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground">Customer not found.</p>
          <Button asChild variant="outline">
            <Link href="/people/customers">Back to customers</Link>
          </Button>
        </Main>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Customer</h2>
            <p className="text-muted-foreground">{customer.name}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/people/customers">Back to list</Link>
          </Button>
        </div>

        <CustomerForm
          form={form}
          onSubmit={onSubmit}
          id="customer-edit-form"
          isPending={isPending}
          customer={customer}
          customerGroups={groups}
          isEdit
        />
      </Main>
    </AuthenticatedLayout>
  )
}
