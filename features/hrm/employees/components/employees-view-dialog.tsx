'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

import {
  salesAgentTypes,
  statusTypes,
} from '@/features/hrm/employees/constants'
import { type Employee } from '@/features/hrm/employees/types'

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

  const content = <EmployeesView currentRow={currentRow} />

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View complete information for this employee below.
            </DialogDescription>
          </DialogHeader>
          <div className='max-h-[70vh] overflow-y-auto py-1 pe-2'>
            {content}
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
          <DrawerDescription>
            View complete information for this employee below.
          </DrawerDescription>
        </DrawerHeader>
        <div className='no-scrollbar max-h-[80vh] overflow-y-auto px-4'>
          {content}
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
  const statusBadgeColor =
    statusTypes.get(currentRow.active_status) || 'bg-neutral-100'
  const salesAgentBadgeColor =
    salesAgentTypes.get(currentRow.sales_agent) || 'bg-neutral-100'

  const employee = currentRow as Employee

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Info */}
      <div className='flex items-center gap-4'>
        {currentRow.image_url ? (
          <Image
            src={currentRow.image_url}
            alt={currentRow.name}
            width={80}
            height={80}
            className='size-20 rounded-full border object-cover'
            unoptimized
          />
        ) : (
          <div className='flex size-20 items-center justify-center rounded-full border bg-muted text-2xl font-bold'>
            {currentRow.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className='flex-1 space-y-1'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>{currentRow.name}</h2>
            <Badge
              variant='outline'
              className={cn('capitalize', statusBadgeColor)}
            >
              {currentRow.active_status}
            </Badge>
          </div>
          <div className='font-mono text-sm text-muted-foreground'>
            {currentRow.staff_id}
            {employee.employee_code && ` • Code: ${employee.employee_code}`}
          </div>
          <div className='text-sm text-muted-foreground'>
            {currentRow.designation?.name || 'No Designation'} •{' '}
            {currentRow.department?.name || 'No Department'}
          </div>
        </div>
      </div>

      <Separator />

      {/* Grid: Basic & Location */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Email</div>
          <div className='text-sm font-medium'>{currentRow.email || '-'}</div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Phone</div>
          <div className='text-sm font-medium'>
            {currentRow.phone_number || '-'}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Location
          </div>
          <div className='text-sm font-medium'>
            {[
              currentRow.city?.name,
              currentRow.state?.name,
              currentRow.country?.name,
            ]
              .filter(Boolean)
              .join(', ') || '-'}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Address
          </div>
          <div className='text-sm font-medium'>{currentRow.address || '-'}</div>
        </div>
      </div>

      <Separator />

      {/* Employment Details */}
      <div className='space-y-4'>
        <h4 className='text-sm font-semibold'>Employment Details</h4>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Status</div>
            <div className='text-sm capitalize'>
              {employee.employment_status || '-'}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Type</div>
            <div className='text-sm'>
              {employee.employment_type?.name || '-'}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Shift</div>
            <div className='text-sm'>
              {currentRow.shift
                ? `${currentRow.shift.name} (${currentRow.shift.start_time} - ${currentRow.shift.end_time})`
                : '-'}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Joining Date</div>
            <div className='text-sm'>{employee.joining_date || '-'}</div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Probation End</div>
            <div className='text-sm'>{employee.probation_end_date || '-'}</div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Confirmation Date</div>
            <div className='text-sm'>{employee.confirmation_date || '-'}</div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Reporting Manager</div>
            <div className='text-sm'>
              {employee.reporting_manager?.name || '-'}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Work Location</div>
            <div className='text-sm'>
              {employee.work_location?.name || '-'}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-xs text-muted-foreground'>Warehouse</div>
            <div className='text-sm'>
              {employee.warehouse?.name || '-'}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Profile & Finance (if exists) */}
      {currentRow.profile && (
        <div className='space-y-4 rounded-lg border bg-muted/30 p-4'>
          <h4 className='text-sm font-semibold'>Profile & Financials</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground'>Date of Birth</div>
              <div className='text-sm'>
                {currentRow.profile.date_of_birth || '-'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground'>
                Gender & Marital
              </div>
              <div className='text-sm capitalize'>
                {[currentRow.profile.gender, currentRow.profile.marital_status]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground'>
                National ID / Tax No.
              </div>
              <div className='text-sm'>
                {currentRow.profile.national_id || '-'} /{' '}
                {currentRow.profile.tax_number || '-'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground'>Bank Details</div>
              <div className='text-sm'>
                {currentRow.profile.bank_name
                  ? `${currentRow.profile.bank_name} (${currentRow.profile.account_number})`
                  : '-'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-xs text-muted-foreground'>Salary & Structure</div>
              <div className='text-sm'>
                <span className='font-mono'>
                  ${Number(currentRow.basic_salary).toFixed(2)}
                </span>
                {employee.salary_structure?.name ? ` (${employee.salary_structure.name})` : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Agent Details */}
      {currentRow.is_sale_agent && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-semibold'>Sales Tracking</h4>
            <Badge
              variant='outline'
              className={cn('capitalize', salesAgentBadgeColor)}
            >
              Sales Agent
            </Badge>
          </div>
          <div className='text-sm'>
            Base Commission:{' '}
            <span className='font-mono'>
              {currentRow.sale_commission_percent}%
            </span>
          </div>
          {currentRow.sales_target.length > 0 && (
            <div className='overflow-hidden rounded-md border text-sm'>
              <div className='grid grid-cols-3 bg-muted p-2 font-semibold text-muted-foreground'>
                <div>From</div>
                <div>To</div>
                <div>Percent</div>
              </div>
              {currentRow.sales_target.map((t, idx) => (
                <div key={idx} className='grid grid-cols-3 border-t p-2'>
                  <div className='font-mono'>${t.sales_from}</div>
                  <div className='font-mono'>${t.sales_to}</div>
                  <div className='font-mono'>{t.percent}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Documents */}
      <div className='space-y-4'>
        <h4 className='text-sm font-semibold'>
          Documents ({currentRow.documents?.length || 0})
        </h4>
        {currentRow.documents && currentRow.documents.length > 0 ? (
          <div className='grid gap-3'>
            {currentRow.documents.map((doc) => (
              <div
                key={doc.id}
                className='flex items-start justify-between rounded-md border bg-muted/10 p-3'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-sm font-medium'>
                      {doc.name || `Document #${doc.id}`}
                    </p>
                    {/* Render Document Type Badge if available */}
                    {employee.documents?.find((d: any) => d.id === doc.id)?.document_type?.name && (
                      <Badge variant='secondary' className='text-[10px] h-5'>
                        {employee.documents.find((d: any) => d.id === doc.id)?.document_type?.name}
                      </Badge>
                    )}
                  </div>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {doc.issue_date && <span>Issued: {doc.issue_date} </span>}
                    {doc.expiry_date && (
                      <span
                        className={cn(
                          doc.is_expired && 'font-semibold text-destructive'
                        )}
                      >
                        | Exp: {doc.expiry_date}{' '}
                        {doc.is_expired ? '(Expired)' : ''}
                      </span>
                    )}
                  </p>
                  {doc.notes && (
                    <p className='mt-1 text-xs italic'>{doc.notes}</p>
                  )}
                </div>
                {doc.file_url && (
                  <Button variant='outline' size='sm' asChild>
                    <a href={doc.file_url} target='_blank' rel='noreferrer'>
                      View File
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground italic'>
            No documents attached.
          </p>
        )}
      </div>

      <Separator />

      {/* Access info */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Username
          </div>
          <div className='text-sm'>
            {currentRow.user?.username || 'No login access'}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Roles</div>
          <div className='text-sm'>
            {currentRow.user?.roles?.map((r) => r.name).join(', ') || '-'}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>Permissions</div>
          <div className='text-sm'>
            {currentRow.user?.permissions?.length
              ? `${currentRow.user.permissions.length} direct permissions`
              : '-'}
          </div>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Created At
          </div>
          <div className='text-sm text-muted-foreground'>
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : 'N/A'}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='text-sm font-medium text-muted-foreground'>
            Updated At
          </div>
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