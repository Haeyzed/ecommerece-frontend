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
import { useCreateBiller } from '../api'
import { billerSchema, type BillerFormData } from '../schemas'
import { BillerForm } from './biller-form'

const defaultValues: Partial<BillerFormData> = {
  name: '',
  company_name: '',
  vat_number: null,
  email: '',
  phone_number: '',
  address: '',
  city: '',
  state: null,
  postal_code: null,
  country: null,
  image: [],
  is_active: true,
}

export function BillerCreateClient() {
  const router = useRouter()
  const { mutate: createBiller, isPending } = useCreateBiller()

  const form = useForm<BillerFormData>({
    resolver: zodResolver(billerSchema) as Resolver<BillerFormData>,
    defaultValues: defaultValues as BillerFormData,
  })

  const onSubmit = (data: BillerFormData) => {
    createBiller(data, {
      onSuccess: (biller) => {
        router.push('/people/billers/' + biller.id)
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
          <h2 className="text-2xl font-bold tracking-tight">Add Biller</h2>
          <p className="text-muted-foreground">
            Create a new biller. Fill in the details below.
          </p>
        </div>

        <BillerForm
          form={form}
          onSubmit={onSubmit}
          id="biller-create-form"
          isPending={isPending}
          isEdit={false}
        />
      </Main>
    </AuthenticatedLayout>
  )
}
