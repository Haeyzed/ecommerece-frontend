"use client"

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { statusTypes, salesAgentTypes } from '@/features/hrm/employees/constants'
import { type Employee } from '@/features/hrm/employees/types'
import Image from 'next/image'

import { useOptionRoles } from '@/features/settings/acl/roles/api'
import { useOptionPermissions } from '@/features/settings/acl/permissions/api'

type EmployeesViewDialogProps = {
  currentRow?: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeesViewDialog({
                                      currentRow,
                                      open,
                                      onOpenChange,
                                    }: EmployeesViewDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (!currentRow) return null

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View detailed information about this employee below.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            <EmployeesView currentRow={currentRow} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Employee Details</DrawerTitle>
          <DrawerDescription>View detailed information about this employee below.</DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          <EmployeesView currentRow={currentRow} />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface EmployeesViewProps {
  className?: string
  currentRow: Employee
}

function EmployeesView({ className, currentRow }: EmployeesViewProps) {
  const statusBadgeColor = statusTypes.get(currentRow.active_status)
  const salesBadgeColor = salesAgentTypes.get(currentRow.sales_agent)

  const [showAllRoles, setShowAllRoles] = useState(false)
  const [showAllPermissions, setShowAllPermissions] = useState(false)
  const [rolesSearchQuery, setRolesSearchQuery] = useState('')
  const [permissionsSearchQuery, setPermissionsSearchQuery] = useState('')

  const { data: rolesOptions = [] } = useOptionRoles()
  const { data: permissionsOptions = [] } = useOptionPermissions()

  const ITEM_LIMIT = 30

  // -------------------------
  // Roles Formatting & Filtering
  // -------------------------
  const formattedRoles = useMemo(() => {
    const rawRoles = currentRow.user?.roles || []
    return rawRoles.map((roleItem: any) => {
      const isObject = typeof roleItem === 'object' && roleItem !== null
      const id = isObject ? roleItem.id : roleItem
      const name = isObject ? roleItem.name : (rolesOptions.find((r) => r.value === id)?.label || `Role #${id}`)
      return { id, name }
    })
  }, [currentRow.user?.roles, rolesOptions])

  const filteredRoles = useMemo(() => {
    if (!rolesSearchQuery) return formattedRoles
    return formattedRoles.filter(r => r.name.toLowerCase().includes(rolesSearchQuery.toLowerCase()))
  }, [formattedRoles, rolesSearchQuery])

  const visibleRoles = showAllRoles ? filteredRoles : filteredRoles.slice(0, ITEM_LIMIT)

  // -------------------------
  // Permissions Formatting & Filtering
  // -------------------------
  const formattedPermissions = useMemo(() => {
    const rawPerms = currentRow.user?.permissions || []
    return rawPerms.map((permItem: any) => {
      const isObject = typeof permItem === 'object' && permItem !== null
      const id = isObject ? permItem.id : permItem
      const name = isObject ? permItem.name : (permissionsOptions.find((p) => p.value === id)?.label || `Permission #${id}`)
      return { id, name }
    })
  }, [currentRow.user?.permissions, permissionsOptions])

  const filteredPermissions = useMemo(() => {
    if (!permissionsSearchQuery) return formattedPermissions
    return formattedPermissions.filter(p => p.name.toLowerCase().includes(permissionsSearchQuery.toLowerCase()))
  }, [formattedPermissions, permissionsSearchQuery])

  const visiblePermissions = showAllPermissions ? filteredPermissions : filteredPermissions.slice(0, ITEM_LIMIT)


  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-start justify-between'>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
            {currentRow.image_url ? (
              <Image
                src={currentRow.image_url}
                alt={currentRow.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-lg font-semibold text-muted-foreground">
                {currentRow.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className='space-y-1'>
            <div className='text-xl font-semibold'>{currentRow.name}</div>
            <div className='text-sm text-muted-foreground font-mono'>
              ID: {currentRow.staff_id}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge variant='outline' className={cn('capitalize', statusBadgeColor)}>
            {currentRow.active_status}
          </Badge>
          {currentRow.is_sale_agent && (
            <Badge variant='outline' className={cn('capitalize', salesBadgeColor)}>
              Sales Agent
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='space-y-4'>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact & Location</h4>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Email</div>
            <div className='text-sm font-medium'>{currentRow.email || '-'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Phone</div>
            <div className='text-sm font-medium'>{currentRow.phone_number || '-'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Address</div>
            <div className='text-sm'>
              {currentRow.address || '-'}
              {(currentRow.city || currentRow.state || currentRow.country) && (
                <div className="text-muted-foreground mt-0.5">
                  {[currentRow.city?.name, currentRow.state?.name, currentRow.country?.name].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Work Details</h4>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Department</div>
            <div className='text-sm font-medium'>{currentRow.department?.name || '-'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Designation</div>
            <div className='text-sm font-medium'>{currentRow.designation?.name || '-'}</div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Shift</div>
            <div className='text-sm font-medium'>
              {currentRow.shift ? (
                <span>{currentRow.shift.name} ({currentRow.shift.start_time} - {currentRow.shift.end_time})</span>
              ) : '-'}
            </div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>Basic Salary</div>
            <div className='text-sm font-medium'>${Number(currentRow.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <Separator />

      {currentRow.is_sale_agent && (
        <>
          <div className='space-y-4'>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sales Agent Configuration</h4>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Global Commission</div>
                <div className='text-sm font-medium'>
                  {currentRow.sale_commission_percent !== null ? `${currentRow.sale_commission_percent}%` : '-'}
                </div>
              </div>
            </div>

            {currentRow.sales_target && currentRow.sales_target.length > 0 && (
              <div className='space-y-2 pt-2'>
                <div className='text-sm font-medium text-muted-foreground mb-2'>Tiered Sales Targets</div>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Sales From</th>
                      <th className="p-2 text-left font-medium">Sales To</th>
                      <th className="p-2 text-left font-medium">Commission %</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {currentRow.sales_target.map((target, idx) => (
                      <tr key={idx}>
                        <td className="p-2 tabular-nums">${Number(target.sales_from).toLocaleString()}</td>
                        <td className="p-2 tabular-nums">${Number(target.sales_to).toLocaleString()}</td>
                        <td className="p-2 tabular-nums">{target.percent}%</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {currentRow.user && (
        <>
          <div className='space-y-6'>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Access</h4>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Username</div>
                <div className='text-sm font-medium font-mono'>{currentRow.user.username || (currentRow.user as any).name}</div>
              </div>
              <div className='space-y-2'>
                <div className='text-sm font-medium text-muted-foreground'>Account Status</div>
                <div className='text-sm font-medium'>
                  <Badge variant={currentRow.user.is_active ? 'default' : 'secondary'}>
                    {currentRow.user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div className='space-y-3 pt-2'>
              <div className='flex items-center justify-between'>
                <div className='text-sm font-medium'>Assigned Roles ({filteredRoles.length})</div>
                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search roles..."
                      className="pl-8 h-9"
                      value={rolesSearchQuery}
                      onChange={(e) => setRolesSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredRoles.length > ITEM_LIMIT && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowAllRoles(!showAllRoles)}
                      className="h-auto p-0 ml-2"
                    >
                      {showAllRoles ? 'Show less' : `Show all ${filteredRoles.length}`}
                    </Button>
                  )}
                </div>
              </div>

              {formattedRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleRoles.length > 0 ? (
                    visibleRoles.map((role) => (
                      <Badge key={`role-${role.id}`} variant="secondary">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No roles match your search.</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">No roles assigned.</span>
              )}
            </div>

            <Separator className="my-2" />

            {/* Permissions Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='text-sm font-medium'>Direct Permissions ({filteredPermissions.length})</div>
                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search permissions..."
                      className="pl-8 h-9"
                      value={permissionsSearchQuery}
                      onChange={(e) => setPermissionsSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredPermissions.length > ITEM_LIMIT && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowAllPermissions(!showAllPermissions)}
                      className="h-auto p-0 ml-2"
                    >
                      {showAllPermissions ? 'Show less' : `Show all ${filteredPermissions.length}`}
                    </Button>
                  )}
                </div>
              </div>

              {formattedPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visiblePermissions.length > 0 ? (
                    visiblePermissions.map((perm) => (
                      <Badge key={`perm-${perm.id}`} variant="outline">
                        {perm.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No permissions match your search.</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">No direct permissions assigned.</span>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Created At</div>
          <div className='text-sm text-muted-foreground'>
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Updated At</div>
          <div className='text-sm text-muted-foreground'>
            {currentRow.updated_at
              ? new Date(currentRow.updated_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}