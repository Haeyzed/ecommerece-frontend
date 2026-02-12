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
import { useBiller, useUpdateBiller } from '../api'
import { billerSchema, type BillerFormData } from '../schemas'
import { BillerForm } from './biller-form'

type BillerEditClientProps = {
  id: string
}

export function BillerEditClient({ id }: BillerEditClientProps) {
  const router = useRouter()
  const billerId = Number(id)
  const { data: biller, isLoading: billerLoading } = useBiller(billerId)
  const { mutate: updateBiller, isPending } = useUpdateBiller()

  const form = useForm<BillerFormData>({
    resolver: zodResolver(billerSchema) as Resolver<BillerFormData>,
    defaultValues: {
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
    },
  })

  useEffect(() => {
    if (!biller) return
    form.reset({
      name: biller.name ?? '',
      company_name: biller.company_name ?? '',
      vat_number: biller.vat_number ?? null,
      email: biller.email ?? '',
      phone_number: biller.phone_number ?? '',
      address: biller.address ?? '',
      city: biller.city ?? '',
      state: biller.state ?? null,
      postal_code: biller.postal_code ?? null,
      country: biller.country ?? null,
      image: [],
      is_active: biller.is_active ?? true,
    })
  }, [biller, form])

  const onSubmit = (data: BillerFormData) => {
    const payload = { ...data }
    if (!payload.image?.length) delete (payload as Partial<BillerFormData>).image
    updateBiller(
      { id: billerId, data: payload },
      {
        onSuccess: () => {
          router.push(`/people/billers/${billerId}`)
        },
      }
    )
  }

  const isLoading = billerLoading

  if (isLoading && !biller) {
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

  if (!biller) {
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
          <p className="text-muted-foreground">Biller not found.</p>
          <Button asChild variant="outline">
            <Link href="/people/billers">Back to billers</Link>
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
            <h2 className="text-2xl font-bold tracking-tight">Edit Biller</h2>
            <p className="text-muted-foreground">{biller.name}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/people/billers">Back to list</Link>
          </Button>
        </div>

        <BillerForm
          form={form}
          onSubmit={onSubmit}
          id="biller-edit-form"
          isPending={isPending}
          biller={biller}
          isEdit
        />
      </Main>
    </AuthenticatedLayout>
  )
}
