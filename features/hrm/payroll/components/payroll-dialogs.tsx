'use client'

import { PayrollActionDialog } from '@/features/hrm/payroll'
import { usePayroll } from '@/features/hrm/payroll'
import { useAuthSession } from '@/features/auth/api'

export function PayrollDialogs() {
  const { open, setOpen } = usePayroll()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreate = userPermissions.includes('create payrolls') || userPermissions.includes('view payroll runs')
  return (
    <>
      {canCreate && (
        <PayrollActionDialog
          key='payroll-add'
          open={open === 'add'}
          onOpenChange={(isOpen) => { if (!isOpen) setOpen(null) }}
        />
      )}
    </>
  )
}
