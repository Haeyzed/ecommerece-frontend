'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/features/auth/api'

export function SuppliersEmptyState() {
  const { data: session } = useAuthSession()
  const canCreate = session?.user?.user_permissions?.includes('suppliers-create')

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon icon={UserGroupIcon} className="size-8 text-muted-foreground" strokeWidth={2} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No suppliers yet</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first supplier.
        </p>
      </div>
      {canCreate && (
        <Button asChild>
          <Link href="/people/suppliers/create">Add Supplier</Link>
        </Button>
      )}
    </div>
  )
}
