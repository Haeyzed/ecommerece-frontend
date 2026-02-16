'use client'

import { useCurrencies } from './currencies-provider'
import { useAuthSession } from '@/features/auth/api'

export function CurrenciesPrimaryButtons() {
  useCurrencies()
  useAuthSession()
  return null
}
