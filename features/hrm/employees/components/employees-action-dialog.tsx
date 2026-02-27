'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CancelCircleIcon,
  CloudUploadIcon,
  PlusSignIcon,
  Delete02Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { Controller, useForm, useFieldArray, type UseFormReturn } from 'react-hook-form'

import {
  useCreateEmployee,
  useUpdateEmployee,
} from '@/features/hrm/employees/api'
import { useOptionDepartments } from '@/features/hrm/departments/api'
import { useOptionDesignations } from '@/features/hrm/designations/api'
import { useOptionShifts } from '@/features/hrm/shifts/api'
import { useOptionRoles } from '@/features/settings/acl/roles/api'
import { useOptionPermissions } from '@/features/settings/acl/permissions/api'
import { useOptionCountries, useStatesByCountry } from '@/features/settings/countries/api'
import { useCitiesByState } from '@/features/settings/states/api'

import { employeeSchema, type EmployeeFormData } from '@/features/hrm/employees/schemas'
import { type Employee, type RolePermission } from '../types'

import { DepartmentsActionDialog } from '@/features/hrm/departments'
import { DesignationsActionDialog } from '@/features/hrm/designations'
import { ShiftsActionDialog } from '@/features/hrm/shifts'

import { useMediaQuery } from '@/hooks/use-media-query'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

import { ImageZoom } from '@/components/ui/image-zoom'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { PhoneInput } from '@/components/ui/phone-input'
import { PasswordInput } from '@/components/password-input'

type EmployeesActionDialogProps = {
  currentRow?: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeesActionDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: EmployeesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee()
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee()
  const isLoading = isCreating || isUpdating

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        staff_id: currentRow.staff_id,
        email: currentRow.email ?? '',
        phone_number: currentRow.phone_number ?? '',
        basic_salary: currentRow.basic_salary,
        address: currentRow.address ?? '',
        department_id: currentRow.department_id ?? undefined,
        designation_id: currentRow.designation_id ?? undefined,
        shift_id: currentRow.shift_id ?? undefined,
        country_id: currentRow.country_id ?? undefined,
        state_id: currentRow.state_id ?? undefined,
        city_id: currentRow.city_id ?? undefined,
        is_active: currentRow.is_active,
        is_sale_agent: currentRow.is_sale_agent,
        sale_commission_percent: currentRow.sale_commission_percent ?? undefined,
        sales_target: currentRow.sales_target || [],
        user_id: currentRow.user_id ?? undefined,
        user: currentRow.user ? {
          username: currentRow.user.username ?? '',
          password: '',
          roles: currentRow.user.roles?.map((r) => r.id) || [],
          permissions: currentRow.user.permissions?.map((p) => p.id) || [],
        } : undefined,
        image: [],
      }
      : {
        name: '',
        staff_id: '',
        email: '',
        phone_number: '',
        basic_salary: 0,
        address: '',
        department_id: undefined,
        designation_id: undefined,
        shift_id: undefined,
        country_id: undefined,
        state_id: undefined,
        city_id: undefined,
        is_active: true,
        is_sale_agent: false,
        sale_commission_percent: undefined,
        sales_target: [],
        user_id: undefined,
        user: undefined,
        image: [],
      },
  })

  const onSubmit = (values: EmployeeFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateEmployee({ id: currentRow.id, data: values }, options)
    } else {
      createEmployee(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the employee details here. ' : 'Create a new employee here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4'>
            <EmployeeForm form={form} onSubmit={onSubmit} id='employee-form' isEdit={isEdit} currentRow={currentRow} />
          </div>

          <DialogFooter>
            <Button type='submit' form='employee-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the employee details here. ' : 'Create a new employee here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <EmployeeForm form={form} onSubmit={onSubmit} id='employee-form' isEdit={isEdit} currentRow={currentRow} />
        </div>

        <DrawerFooter>
          <Button type='submit' form='employee-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface EmployeeFormProps {
  form: UseFormReturn<EmployeeFormData>
  onSubmit: (data: EmployeeFormData) => void
  id: string
  className?: string
  isEdit: boolean
  currentRow?: Employee
}

function EmployeeForm({ form, onSubmit, id, className, isEdit, currentRow }: EmployeeFormProps) {
  const { resolvedTheme } = useTheme()
  const countryId = form.watch('country_id')
  const stateId = form.watch('state_id')
  const isSaleAgent = form.watch('is_sale_agent')

  const hasUserAccount = !!form.watch('user_id') || !!form.watch('user')

  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [isDesignationOpen, setIsDesignationOpen] = useState(false)
  const [isShiftOpen, setIsShiftOpen] = useState(false)

  const { data: optionDepartments } = useOptionDepartments()
  const { data: optionDesignations } = useOptionDesignations()
  const { data: optionShifts } = useOptionShifts()
  const { data: optionCountries } = useOptionCountries()
  const { data: statesData } = useStatesByCountry(countryId ?? null)
  const { data: citiesData } = useCitiesByState(stateId ?? null)
  const { data: rolesOptions = [] } = useOptionRoles()
  const { data: permissionsOptions = [] } = useOptionPermissions()

  const countryOptions = Array.isArray(optionCountries) ? optionCountries : []
  const stateOptions = Array.isArray(statesData) ? statesData : []
  const cityOptions = Array.isArray(citiesData) ? citiesData : []

  const rolesAnchor = useComboboxAnchor()
  const permsAnchor = useComboboxAnchor()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sales_target"
  })

  return (
    <>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Primary Info */}
          <FieldGroup className="space-y-4">
            <h3 className="text-lg font-medium leading-none">Basic Information</h3>

            <Controller
              control={form.control}
              name='image'
              render={({ field: { value, onChange, ...fieldProps }, fieldState }) => {
                const existingImageUrl = isEdit && currentRow?.image_url ? currentRow.image_url : null
                const hasNewImage = value instanceof File || (Array.isArray(value) && value.length > 0)

                return (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor='employee-image'>Profile Image</FieldLabel>

                    {existingImageUrl && !hasNewImage && (
                      <div className='mb-3 flex items-center gap-3 rounded-md border p-3'>
                        <div className='relative size-16 overflow-hidden rounded-md bg-muted'>
                          <ImageZoom
                            backdropClassName={cn(
                              resolvedTheme === 'dark'
                                ? '[&_[data-rmiz-modal-overlay="visible"]]:bg-white/80'
                                : '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                            )}
                          >
                            <Image
                              src={existingImageUrl}
                              alt={currentRow?.name || 'Employee image'}
                              width={64}
                              height={64}
                              className='h-full w-full object-cover'
                              unoptimized
                            />
                          </ImageZoom>
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-medium'>Current Image</p>
                          <p className='text-xs text-muted-foreground'>Upload a new image to replace</p>
                        </div>
                      </div>
                    )}

                    <FileUpload
                      value={value as File[] | undefined}
                      onValueChange={onChange}
                      accept='image/*'
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, message) => form.setError('image', { message })}
                    >
                      <FileUploadDropzone className='flex-row flex-wrap border-dotted text-center'>
                        <HugeiconsIcon icon={CloudUploadIcon} className='size-4' />
                        Drag and drop or
                        <FileUploadTrigger asChild>
                          <Button variant='link' size='sm' className='p-0'>choose file</Button>
                        </FileUploadTrigger>
                        to upload
                      </FileUploadDropzone>
                      <FileUploadList>
                        {value?.map((file, index) => (
                          <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button variant='ghost' size='icon' className='size-7'>
                                <HugeiconsIcon icon={CancelCircleIcon} className='size-4' />
                                <span className='sr-only'>Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                    <FieldDescription>JPEG, PNG, JPG, WebP. Max 5MB.</FieldDescription>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />

            <Controller control={form.control} name='name' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='employee-name'>Full Name <span className="text-destructive">*</span></FieldLabel>
                <Input id='employee-name' placeholder='Jane Doe' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='staff_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='employee-staff-id'>Staff ID <span className="text-destructive">*</span></FieldLabel>
                <Input id='employee-staff-id' placeholder='EMP-001' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='email' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='employee-email'>Email Address</FieldLabel>
                <Input id='employee-email' type="email" placeholder='janedoe@example.com' autoComplete='off' {...field} value={field.value || ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='phone_number' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='employee-phone'>Phone Number</FieldLabel>
                <PhoneInput id='employee-phone' placeholder='Phone number' autoComplete='off' {...field} value={field.value || ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
          </FieldGroup>

          {/* Right Column - Work Details */}
          <FieldGroup className="space-y-4">
            <h3 className="text-lg font-medium leading-none">Work Details</h3>

            <Controller control={form.control} name='department_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-department'>Department <span className="text-destructive">*</span></FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Combobox
                      items={optionDepartments || []}
                      itemToStringLabel={(item) => item.label}
                      value={optionDepartments?.find((p) => p.value === field.value) ?? null}
                      onValueChange={(item) => field.onChange(item?.value ?? null)}
                    >
                      <ComboboxInput id='employee-department' placeholder='Select department...' showClear/>
                      <ComboboxContent>
                        <ComboboxEmpty>No department found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDepartmentOpen(true)}
                    className="shrink-0"
                    title="Add Department"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  </Button>
                </div>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='designation_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-designation'>Designation <span className="text-destructive">*</span></FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Combobox
                      items={optionDesignations || []}
                      itemToStringLabel={(item) => item.label}
                      value={optionDesignations?.find((p) => p.value === field.value) ?? null}
                      onValueChange={(item) => field.onChange(item?.value ?? null)}
                    >
                      <ComboboxInput id='employee-designation' placeholder='Select designation...' showClear/>
                      <ComboboxContent>
                        <ComboboxEmpty>No designation found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDesignationOpen(true)}
                    className="shrink-0"
                    title="Add Designation"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  </Button>
                </div>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='shift_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-shift'>Shift <span className="text-destructive">*</span></FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Combobox
                      items={optionShifts || []}
                      itemToStringLabel={(item) => item.label}
                      value={optionShifts?.find((p) => p.value === field.value) ?? null}
                      onValueChange={(item) => field.onChange(item?.value ?? null)}
                    >
                      <ComboboxInput id='employee-shift' placeholder='Select shift...' showClear/>
                      <ComboboxContent>
                        <ComboboxEmpty>No shift found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsShiftOpen(true)}
                    className="shrink-0"
                    title="Add Shift"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  </Button>
                </div>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='basic_salary' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='employee-salary'>Basic Salary <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id='employee-salary'
                  type="number"
                  min={0}
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='is_active' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-row items-center justify-between rounded-md border p-4'>
                <div className='space-y-0.5'>
                  <FieldLabel htmlFor='employee-active'>Active Status</FieldLabel>
                  <FieldDescription>Disabling this will hide the employee from the system.</FieldDescription>
                </div>
                <Switch id='employee-active' checked={!!field.value} onCheckedChange={field.onChange} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
          </FieldGroup>
        </div>

        {/* Full Width Location Section */}
        <FieldGroup className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium leading-none">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller control={form.control} name='country_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-country'>Country</FieldLabel>
                <Combobox
                  items={countryOptions}
                  itemToStringLabel={(item) => item.label}
                  value={countryOptions.find((p) => p.value === field.value) ?? null}
                  onValueChange={(item) => {
                    field.onChange(item?.value ?? null)
                    form.setValue('state_id', undefined)
                    form.setValue('city_id', undefined)
                  }}
                >
                  <ComboboxInput id='employee-country' placeholder='Select country...' showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>No country found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='state_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-state'>State</FieldLabel>
                <Combobox
                  items={stateOptions}
                  itemToStringLabel={(item) => item.label}
                  value={stateOptions.find((p) => p.value === field.value) ?? null}
                  onValueChange={(item) => {
                    field.onChange(item?.value ?? null)
                    form.setValue('city_id', undefined)
                  }}
                >
                  <ComboboxInput id='employee-state' placeholder='Select state...' showClear disabled={!countryId} />
                  <ComboboxContent>
                    <ComboboxEmpty>No state found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />

            <Controller control={form.control} name='city_id' render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className='flex flex-col'>
                <FieldLabel htmlFor='employee-city'>City</FieldLabel>
                <Combobox
                  items={cityOptions}
                  itemToStringLabel={(item) => item.label}
                  value={cityOptions.find((p) => p.value === field.value) ?? null}
                  onValueChange={(item) => field.onChange(item?.value ?? null)}
                >
                  <ComboboxInput id='employee-city' placeholder='Select city...' showClear disabled={!stateId} />
                  <ComboboxContent>
                    <ComboboxEmpty>No city found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
          </div>

          <Controller control={form.control} name='address' render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='employee-address'>Address</FieldLabel>
              <Textarea id='employee-address' placeholder='Full address' rows={2} className='resize-none' {...field} value={field.value || ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )} />
        </FieldGroup>

        {/* System User Section */}
        <FieldGroup className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-none">System Access</h3>
            {!hasUserAccount && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setValue('user', { username: '', password: '', roles: [], permissions: [] })}
              >
                Create Account
              </Button>
            )}
            {hasUserAccount && !currentRow?.user_id && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => form.setValue('user', undefined)}
              >
                Remove Account Details
              </Button>
            )}
          </div>

          {hasUserAccount && (
            <div className="space-y-4 rounded-md border p-4 bg-muted/20">
              <div className="grid grid-cols-2 gap-4">
                <Controller control={form.control} name='user.username' render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor='user-username'>Username <span className="text-destructive">*</span></FieldLabel>
                    <Input id='user-username' placeholder='Unique username' autoComplete='off' {...field} value={field.value || ''} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Controller control={form.control} name='user.password' render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor='user-password'>Password {isEdit ? '(Leave blank to keep)' : <span className="text-destructive">*</span>}</FieldLabel>
                    <PasswordInput id='user-password' placeholder='Min 8 characters' autoComplete='new-password' {...field} value={field.value || ''} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
              </div>

              <Controller control={form.control} name="user.roles" render={({ field, fieldState }) => {
                const selectedItems = field.value
                ? field.value
                  .map((r) => rolesOptions.find((opt) => opt.value === r.id))
                  .filter((opt): opt is { value: number; label: string } => !!opt)
                : []

                return (
                  <Field data-invalid={!!fieldState.error} className="flex flex-col">
                    <FieldLabel>Roles</FieldLabel>
                    <Combobox
                      multiple
                      autoHighlight
                      items={rolesOptions}
                      itemToStringLabel={(item) => item.label}
                      value={selectedItems}
                      onValueChange={(items) => {
                        field.onChange(items.map((item) => item.value))
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxChips ref={rolesAnchor}>
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((item: RolePermission) => <ComboboxChip key={item.value}>{item.label}</ComboboxChip>)}
                              <ComboboxChipsInput placeholder="Select roles..." />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={rolesAnchor}>
                        <ComboboxEmpty>No roles found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }} />

              <Controller control={form.control} name="user.permissions" render={({ field, fieldState }) => {
                const selectedItems = field.value
                ? field.value
                  .map((p) => permissionsOptions.find((opt) => opt.value === p.id))
                  .filter((opt): opt is { value: number; label: string } => !!opt)
                : []

                return (
                  <Field data-invalid={!!fieldState.error} className="flex flex-col">
                    <FieldLabel>Direct Permissions</FieldLabel>
                    <Combobox
                      multiple
                      autoHighlight
                      items={permissionsOptions}
                      itemToStringLabel={(item) => item.label}
                      value={selectedItems}
                      onValueChange={(items) => {
                        field.onChange(items.map((item) => item.value))
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxChips ref={permsAnchor}>
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((item: RolePermission) => <ComboboxChip key={item.value}>{item.label}</ComboboxChip>)}
                              <ComboboxChipsInput placeholder="Select permissions..." />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={permsAnchor}>
                        <ComboboxEmpty>No permissions found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }} />
            </div>
          )}
        </FieldGroup>

        {/* Sales Agent Section */}
        <FieldGroup className="space-y-4 pt-4 border-t">
          <Controller control={form.control} name='is_sale_agent' render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='employee-sales-agent'>Sales Agent</FieldLabel>
                <FieldDescription>Enable to configure sales commissions and targets.</FieldDescription>
              </div>
              <Switch id='employee-sales-agent' checked={!!field.value} onCheckedChange={(val) => {
                field.onChange(val)
                if (!val) {
                  form.setValue('sale_commission_percent', undefined)
                  form.setValue('sales_target', [])
                }
              }} />
            </Field>
          )} />

          {isSaleAgent && (
            <div className="space-y-4 rounded-md border p-4 bg-muted/10">
              <Controller control={form.control} name='sale_commission_percent' render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor='employee-global-commission'>Global Commission (%)</FieldLabel>
                  <Input
                    id='employee-global-commission'
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <FieldDescription>Base commission rate applied if tiers are not met.</FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>Tiered Sales Targets</FieldLabel>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ sales_from: 0, sales_to: 0, percent: 0 })}>
                    <HugeiconsIcon icon={PlusSignIcon} className="mr-1 size-4" /> Add Tier
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No sales targets configured.</p>
                )}

                {fields.map((target, index) => (
                  <div key={target.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Controller control={form.control} name={`sales_target.${index}.sales_from`} render={({ field }) => (
                        <Field>
                          {index === 0 && <FieldLabel className="text-xs">From Amount</FieldLabel>}
                          <Input type="number" min={0} step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </Field>
                      )} />
                    </div>
                    <div className="col-span-4">
                      <Controller control={form.control} name={`sales_target.${index}.sales_to`} render={({ field }) => (
                        <Field>
                          {index === 0 && <FieldLabel className="text-xs">To Amount</FieldLabel>}
                          <Input type="number" min={0} step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </Field>
                      )} />
                    </div>
                    <div className="col-span-3">
                      <Controller control={form.control} name={`sales_target.${index}.percent`} render={({ field }) => (
                        <Field>
                          {index === 0 && <FieldLabel className="text-xs">Percent (%)</FieldLabel>}
                          <Input type="number" min={0} max={100} step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </Field>
                      )} />
                    </div>
                    <div className="col-span-1 pb-1 flex justify-end">
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {form.formState.errors.sales_target && <p className="text-sm font-medium text-destructive">{form.formState.errors.sales_target.root?.message}</p>}
              </div>
            </div>
          )}
        </FieldGroup>
      </form>

      <DepartmentsActionDialog open={isDepartmentOpen} onOpenChange={setIsDepartmentOpen} />
      <DesignationsActionDialog open={isDesignationOpen} onOpenChange={setIsDesignationOpen} />
      <ShiftsActionDialog open={isShiftOpen} onOpenChange={setIsShiftOpen} />
    </>
  )
}