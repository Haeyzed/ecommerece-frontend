'use client'

import { useLanguages } from './languages-provider'
import { useAuthSession } from '@/features/auth/api'

export function LanguagesPrimaryButtons() {
  useLanguages()
  useAuthSession()
  return null
}
