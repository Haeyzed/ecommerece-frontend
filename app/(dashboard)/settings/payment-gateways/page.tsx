import { auth } from '@/auth'
import { ForbiddenError } from '@/features/errors/forbidden'
import { PaymentGatewaySettingClient } from '@/features/settings/payment-gateway'
import { hasPermission } from '@/lib/utils/permissions'

export const metadata = {
  title: 'Payment Gateways',
}

export default async function PaymentGatewaysSettingPage() {
  const session = await auth()
  const userPermissions = session?.user?.user_permissions ?? []
  const canView = hasPermission(userPermissions, 'payment_gateway_setting')
  if (!canView) {
    return <ForbiddenError />
  }
  return <PaymentGatewaySettingClient />
}
