'use client'

import { useCountries } from './countries-provider'
import { useAuthSession } from '@/features/auth/api'

export function CountriesPrimaryButtons() {
  const { setOpen } = useCountries()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []

  if (!userPermissions.includes('view countries')) return null

  return null
}
