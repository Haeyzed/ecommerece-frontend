/**
 * SMS Settings Types
 *
 * Type definitions for SMS provider (ExternalService type=sms).
 * Aligns with the Laravel API SmsSettingResource.
 *
 * @module features/settings/sms/types
 */

export interface SmsProvider {
  id: number
  name: string
  type: string
  details: Record<string, string>
  active: boolean
  created_at: string | null
  updated_at: string | null
}

/** Detail key config per gateway name for form labels */
export const SMS_GATEWAY_FIELDS: Record<string, { key: string; label: string; type?: 'text' | 'password' }[]> = {
  tonkra: [
    { key: 'api_token', label: 'API Token', type: 'password' },
    { key: 'sender_id', label: 'Sender ID' },
  ],
  revesms: [
    { key: 'apikey', label: 'API Key', type: 'password' },
    { key: 'secretkey', label: 'Secret Key', type: 'password' },
    { key: 'callerID', label: 'Caller ID' },
  ],
  bdbulksms: [{ key: 'token', label: 'Token', type: 'password' }],
  clickatell: [{ key: 'api_key', label: 'API Key', type: 'password' }],
  smstoday: [
    { key: 'api_key', label: 'API Key', type: 'password' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'from', label: 'From' },
  ],
  twilio: [
    { key: 'account_sid', label: 'Account SID', type: 'password' },
    { key: 'auth_token', label: 'Auth Token', type: 'password' },
    { key: 'from', label: 'Twilio Number (From)' },
  ],
}
