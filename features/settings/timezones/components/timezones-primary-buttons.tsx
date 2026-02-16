'use client'

import { useTimezones } from './timezones-provider'
import { useAuthSession } from '@/features/auth/api'

export function TimezonesPrimaryButtons() {
  useTimezones()
  useAuthSession()
  return null
}
