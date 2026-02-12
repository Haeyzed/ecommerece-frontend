'use client'

import { useRouter } from 'next/navigation'
import type { Resolver } from 'react-hook-form'
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
import { useCreateSupplier } from '../api'
import { supplierSchema, type SupplierFormData } from '../schemas'
import { SupplierForm } from './supplier-form'

const defaultValues: Partial<SupplierFormData> = {
  name: '',
  company_name: '',
  vat_number: null,
  email: '',
  phone_number: '',
  wa_number: '',
  address: '',
  city: '',
  state: null,
  postal_code: null,
  country: null,
  opening_balance: 0,
  pay_term_no: null,
  pay_term_period: null,
  image: [],
  is_active: true,
}

export function SupplierCreateClient() {
  const router = useRouter()
  const { mutate: createSupplier, isPending } = useCreateSupplier()

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema) as Resolver<SupplierFormData>,
    defaultValues: defaultValues as SupplierFormData,
  })

  const onSubmit = (data: SupplierFormData) => {
    createSupplier(data, {
      onSuccess: () => {
        router.push('/people/suppliers')
      },
    })
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
          <h2 className="text-2xl font-bold tracking-tight">Add Supplier</h2>
          <p className="text-muted-foreground">
            Create a new supplier. Fill in the details below.
          </p>
        </div>

        <SupplierForm
          form={form}
          onSubmit={onSubmit}
          id="supplier-create-form"
          isPending={isPending}
          isEdit={false}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
