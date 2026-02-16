'use client'

import { useCities } from './cities-provider'
import { useAuthSession } from '@/features/auth/api'

export function CitiesPrimaryButtons() {
  useCities()
  useAuthSession()
  return null
}
