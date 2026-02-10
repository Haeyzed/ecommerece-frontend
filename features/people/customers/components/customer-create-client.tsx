'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Spinner } from '@/components/ui/spinner'
import { useCreateCustomer, useCustomerGroupsActive } from '../api'
import { customerCreateSchema, type CustomerFormData } from '../schemas'
import { CustomerForm } from './customer-form'

const defaultValues: CustomerFormData = {
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
}

export function CustomerCreateClient() {
  const router = useRouter()
  const { data: groups = [], isLoading: groupsLoading } = useCustomerGroupsActive()
  const { mutate: createCustomer, isPending } = useCreateCustomer()

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues,
  })

  const onSubmit = (data: CustomerFormData) => {
    const payload = { ...data }
    if (!payload.email) payload.email = null
    if (!payload.password) payload.password = null
    createCustomer(payload, {
      onSuccess: (customer) => {
        router.push('/people/customers/' + customer.id)
      },
    })
  }

  if (groupsLoading) {
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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Customer</h2>
          <p className="text-muted-foreground">
            Create a new customer. Fill in the details below.
          </p>
        </div>

        <CustomerForm
          form={form}
          onSubmit={onSubmit}
          id="customer-create-form"
          isPending={isPending}
          customerGroups={groups}
          isEdit={false}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
