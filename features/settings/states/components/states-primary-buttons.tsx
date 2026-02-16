'use client'

import { useStates } from './states-provider'
import { useAuthSession } from '@/features/auth/api'

export function StatesPrimaryButtons() {
  const { setOpen } = useStates()
  const { data: session } = useAuthSession()

  const userPermissions = session?.user?.user_permissions || []

  if (!userPermissions.includes('view states')) return null

  return null
}
