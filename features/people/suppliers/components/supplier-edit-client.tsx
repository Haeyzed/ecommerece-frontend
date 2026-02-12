'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { Resolver } from 'react-hook-form'
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
import { useSupplier, useUpdateSupplier } from '../api'
import { supplierSchema, type SupplierFormData } from '../schemas'
import { SupplierForm } from './supplier-form'

type SupplierEditClientProps = {
  id: string
}

export function SupplierEditClient({ id }: SupplierEditClientProps) {
  const router = useRouter()
  const supplierId = Number(id)
  const { data: supplier, isLoading: supplierLoading } = useSupplier(supplierId)
  const { mutate: updateSupplier, isPending } = useUpdateSupplier()

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema) as Resolver<SupplierFormData>,
    defaultValues: {
      name: '',
      company_name: null,
      vat_number: null,
      email: null,
      phone_number: null,
      wa_number: null,
      address: null,
      city: null,
      state: null,
      postal_code: null,
      country: null,
      opening_balance: 0,
      pay_term_no: null,
      pay_term_period: null,
      image: [],
      is_active: true,
    },
  })

  useEffect(() => {
    if (!supplier) return
    form.reset({
      name: supplier.name ?? '',
      company_name: supplier.company_name ?? null,
      vat_number: supplier.vat_number ?? null,
      email: supplier.email ?? null,
      phone_number: supplier.phone_number ?? null,
      wa_number: supplier.wa_number ?? null,
      address: supplier.address ?? null,
      city: supplier.city ?? null,
      state: supplier.state ?? null,
      postal_code: supplier.postal_code ?? null,
      country: supplier.country ?? null,
      opening_balance: supplier.opening_balance ?? 0,
      pay_term_no: supplier.pay_term_no ?? null,
      pay_term_period: supplier.pay_term_period ?? null,
      image: [],
      is_active: supplier.is_active ?? true,
    })
  }, [supplier, form])

  const onSubmit = (data: SupplierFormData) => {
    const payload = { ...data }
    if (!payload.image?.length) delete (payload as Partial<SupplierFormData>).image
    updateSupplier(
      { id: supplierId, data: payload },
      {
        onSuccess: () => {
          router.push('/people/suppliers')
        },
      }
    )
  }

  const isLoading = supplierLoading

  if (isLoading && !supplier) {
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

  if (!supplier) {
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
          <p className="text-muted-foreground">Supplier not found.</p>
          <Button asChild variant="outline">
            <Link href="/people/suppliers">Back to suppliers</Link>
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
            <h2 className="text-2xl font-bold tracking-tight">Edit Supplier</h2>
            <p className="text-muted-foreground">{supplier.name}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/people/suppliers">Back to list</Link>
          </Button>
        </div>

        <SupplierForm
          form={form}
          onSubmit={onSubmit}
          id="supplier-edit-form"
          isPending={isPending}
          supplier={supplier}
          isEdit
        />
      </Main>
    </AuthenticatedLayout>
  )
}
