import { auth } from '@/auth'

import { hasPermission } from '@/lib/utils/permissions'

import { ForbiddenError } from '@/features/errors/forbidden'
import { RewardPointSettingClient } from '@/features/settings/reward-point'

export const metadata = {
  title: 'Reward Point Setting',
}

export default async function RewardPointSettingPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'reward_point_setting')
  if (!canView) {
    return <ForbiddenError />
  }
  return <RewardPointSettingClient />
}
