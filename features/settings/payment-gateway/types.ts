export interface PaymentGatewayModuleStatus {
  pos?: boolean
  ecommerce?: boolean
}

export interface PaymentGateway {
  id: number
  name: string
  type: string
  details: Record<string, string>
  module_status: PaymentGatewayModuleStatus
  active: boolean
  created_at: string | null
  updated_at: string | null
}

export const PAYMENT_MODULE_OPTIONS = [
  { value: 'pos', label: 'POS' },
  { value: 'ecommerce', label: 'Ecommerce' },
] as const
