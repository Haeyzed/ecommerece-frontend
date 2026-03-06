'use client'

import React, { useState } from 'react'

import Image from 'next/image'

import { format } from 'date-fns'

import {
  Controller,
  type UseFormReturn,
  useFieldArray,
  useForm,
} from 'react-hook-form'

import {
  CancelCircleIcon,
  CloudUploadIcon,
  Delete02Icon,
  File02Icon,
  PlusSignIcon,
  Tick02Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { zodResolver } from '@hookform/resolvers/zod'

import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'

import { Button } from '@/components/ui/button'
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
import { ImageZoom } from '@/components/ui/image-zoom'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { DatePicker } from '@/components/date-picker'

import { useAuthSession } from '@/features/auth/api'
import { DepartmentsActionDialog } from '@/features/hrm/departments'
import {
  useDesignationsByDepartment,
  useOptionDepartments,
} from '@/features/hrm/departments/api'
import { DesignationsActionDialog } from '@/features/hrm/designations'
import { useOptionDocumentTypes } from '@/features/hrm/document-types/api'
import {
  useCreateEmployee,
  useOptionEmployees,
  useUpdateEmployee,
} from '@/features/hrm/employees/api'
import {
  type EmployeeFormData,
  employeeSchema,
} from '@/features/hrm/employees/schemas'
import { ShiftsActionDialog } from '@/features/hrm/shifts'
import { useOptionShifts } from '@/features/hrm/shifts/api'
import { useOptionPermissions } from '@/features/settings/acl/permissions/api'
import { useOptionRoles } from '@/features/settings/acl/roles/api'
import {
  useOptionCountries,
  useStatesByCountry,
} from '@/features/settings/countries/api'
import { useCitiesByState } from '@/features/settings/states/api'

import { type Employee } from '../types'
import { RoleOption } from '@/features/settings/acl/roles'
import { PermissionOption } from '@/features/settings/acl/permissions'
import { useOptionEmploymentTypes } from '@/features/hrm/employment-types'
import { PhoneInput } from '@/components/ui/phone-input'
import { useOptionWarehouses } from '@/features/settings/warehouses/api'
import { genderOptions, maritalStatusOptions } from '../constants'

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
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            staff_id: currentRow.staff_id,
            email: currentRow.email || '',
            phone_number: currentRow.phone_number || '',
            address: currentRow.address || '',
            department_id: currentRow.department?.id || 0,
            designation_id: currentRow.designation?.id || 0,
            employment_type_id: currentRow.employment_type?.id || 0,
            shift_id: currentRow.shift?.id || 0,
            basic_salary: currentRow.basic_salary,
            country_id: currentRow.country?.id || null,
            state_id: currentRow.state?.id || null,
            city_id: currentRow.city?.id || null,
            is_active: currentRow.is_active,
            is_sale_agent: currentRow.is_sale_agent,
            sale_commission_percent: currentRow.sale_commission_percent,
            image: [],

            joining_date: currentRow.joining_date || '',
            confirmation_date: currentRow.confirmation_date || '',
            probation_end_date: currentRow.probation_end_date || '',
            reporting_manager_id: currentRow.reporting_manager_id || null,
            warehouse_id: currentRow.warehouse_id || null,
            work_location_id: currentRow.work_location_id || null,
            salary_structure_id: currentRow.salary_structure_id || null,
            employment_status: currentRow.employment_status || '',

            user: currentRow.user
              ? {
                  username: currentRow.user.username,
                  password: '',
                  roles: currentRow.user.roles?.map((r) => r.id) || [],
                  permissions:
                    currentRow.user.permissions?.map((p) => p.id) || [],
                }
              : { username: '', password: '', roles: [], permissions: [] },

            profile: currentRow.profile
              ? {
                  date_of_birth: currentRow.profile.date_of_birth,
                  gender: currentRow.profile.gender,
                  marital_status: currentRow.profile.marital_status,
                  national_id: currentRow.profile.national_id,
                  tax_number: currentRow.profile.tax_number,
                  bank_name: currentRow.profile.bank_name,
                  account_number: currentRow.profile.account_number,
                }
              : {},

            sales_target: currentRow.sales_target || [],

            documents:
              currentRow.documents?.map((doc) => ({
                id: doc.id,
                document_type_id: doc.document_type?.id || 0,
                name: doc.name || '',
                notes: doc.notes || '',
                issue_date: doc.issue_date || '',
                expiry_date: doc.expiry_date || '',
                file: [],
                file_url: doc.file_url, // Keep track of existing URL
              })) || [],
          }
        : {
            name: '',
            staff_id: '',
            email: '',
            phone_number: '',
            address: '',
            department_id: 0,
            designation_id: 0,
            employment_type_id: 0,
            shift_id: 0,
            basic_salary: 0,
            country_id: null,
            state_id: null,
            city_id: null,
            is_active: true,
            is_sale_agent: false,
            sale_commission_percent: 0,
            image: [],
            joining_date: '',
            confirmation_date: '',
            probation_end_date: '',
            reporting_manager_id: null,
            warehouse_id: null,
            work_location_id: null,
            salary_structure_id: null,
            employment_status: '',
            user: { username: '', password: '', roles: [], permissions: [] },
            profile: {
              date_of_birth: '',
              gender: '',
              marital_status: '',
              national_id: '',
              tax_number: '',
              bank_name: '',
              account_number: '',
            },
            sales_target: [],
            documents: [],
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
            <DialogTitle>
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the employee details here. '
                : 'Create a new employee here. '}
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className='-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4'>
            <EmployeeForm
              form={form}
              onSubmit={onSubmit}
              id='employee-form'
              isEdit={isEdit}
              currentRow={currentRow}
            />
          </div>

          <DialogFooter>
            <Button type='submit' form='employee-form' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className='mr-2 size-4' />
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
          <DrawerTitle>
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? 'Update the employee details here. '
              : 'Create a new employee here. '}
            Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <EmployeeForm
            form={form}
            onSubmit={onSubmit}
            id='employee-form'
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </div>

        <DrawerFooter>
          <Button type='submit' form='employee-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className='mr-2 size-4' />
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

function EmployeeForm({
  form,
  onSubmit,
  id,
  className,
  isEdit,
  currentRow,
}: EmployeeFormProps) {
  const { resolvedTheme } = useTheme()
  const { data: session } = useAuthSession()
  const userPermissions = session?.user?.user_permissions || []
  const canCreateDepartment = userPermissions.includes('create departments')
  const canCreateDesignation = userPermissions.includes('create designations')
  const canCreateShift = userPermissions.includes('create shifts')
  const isSaleAgent = form.watch('is_sale_agent')

  const { data: optionDepartments, isLoading: isLoadingDepartments } =
    useOptionDepartments()
  const { data: optionShifts, isLoading: isLoadingShifts } = useOptionShifts()
  const { data: optionCountries, isLoading: isLoadingCountries } =
    useOptionCountries()
  const { data: optionEmploymentTypes, isLoading: isLoadingEmploymentTypes } =
    useOptionEmploymentTypes()
  const { data: optionRoles, isLoading: isLoadingRoles } = useOptionRoles()
  const { data: optionPermissions, isLoading: isLoadingPermissions } =
    useOptionPermissions()
  const { data: optionDocumentTypes, isLoading: isLoadingDocumentTypes } =
    useOptionDocumentTypes()
  const { data: optionWarehouses, isLoading: isLoadingWarehouses } =
    useOptionWarehouses()
  const { data: optionEmployees, isLoading: isLoadingEmployees } =
    useOptionEmployees()

  const departmentId = form.watch('department_id')
  const countryId = form.watch('country_id')
  const stateId = form.watch('state_id')

  const { data: optionDesignations, isLoading: isLoadingDesignations } =
    useDesignationsByDepartment(departmentId ?? null)
  const { data: optionStates, isLoading: isLoadingStates } = useStatesByCountry(
    countryId ?? null
  )
  const { data: optionCities, isLoading: isLoadingCities } = useCitiesByState(
    stateId ?? null
  )

  const {
    fields: salesTargets,
    append: appendSalesTarget,
    remove: removeSalesTarget,
  } = useFieldArray({
    control: form.control,
    name: 'sales_target',
  })

  const {
    fields: documents,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [isDesignationOpen, setIsDesignationOpen] = useState(false)
  const [isShiftOpen, setIsShiftOpen] = useState(false)

  const rolesAnchor = useComboboxAnchor()
  const permissionsAnchor = useComboboxAnchor()

  // Get all currently selected document type IDs
  const selectedDocumentTypeIds = documents.map(
    (doc) => doc.document_type_id
  )

  const createDummyFile = (name: string) => {
    return new File([], name, { type: 'application/octet-stream' })
  }

  return (
    <>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-8', className)}
      >
        {/* --- SECTION 1: PERSONAL INFORMATION --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          <div className='mb-4 border-b pb-2'>
            <h3 className='text-lg font-semibold'>Personal Information</h3>
            <p className='text-sm text-muted-foreground'>
              Basic details and contact information.
            </p>
          </div>
          <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* ... (Previous fields remain unchanged) ... */}
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    Full Name <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Input placeholder='Jane Doe' {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='staff_id'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    Staff ID <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Input placeholder='EMP-001' {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type='email'
                    placeholder='jane@example.com'
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='phone_number'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <PhoneInput placeholder='+1234567890' {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className='col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3'>
              <Controller
                control={form.control}
                name='country_id'
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='flex flex-col'
                  >
                    <FieldLabel>Country</FieldLabel>
                    <Combobox
                      items={optionCountries || []}
                      itemToStringLabel={(item) => item.label}
                      value={
                        (optionCountries || []).find(
                          (c) => c.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) => {
                        field.onChange(item?.value ?? null)
                        form.setValue('state_id', null)
                        form.setValue('city_id', null)
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingCountries ? 'Loading...' : 'Select Country'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No country found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='state_id'
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='flex flex-col'
                  >
                    <FieldLabel>State / Province</FieldLabel>
                    <Combobox
                      items={optionStates || []}
                      itemToStringLabel={(item) => item.label}
                      value={
                        (optionStates || []).find(
                          (s) => s.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) => {
                        field.onChange(item?.value ?? null)
                        form.setValue('city_id', null)
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                      disabled={!countryId}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingStates ? 'Loading...' : 'Select State'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No state found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='city_id'
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='flex flex-col'
                  >
                    <FieldLabel>City</FieldLabel>
                    <Combobox
                      items={optionCities || []}
                      itemToStringLabel={(item) => item.label}
                      value={
                        (optionCities || []).find(
                          (c) => c.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) =>
                        field.onChange(item?.value ?? null)
                      }
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                      disabled={!stateId}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingCities ? 'Loading...' : 'Select City'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No city found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name='address'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='col-span-1 md:col-span-2'
                >
                  <FieldLabel>Full Address</FieldLabel>
                  <Input
                    placeholder='123 Main St, Apt 4B'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Profile Image */}
            <Controller
              control={form.control}
              name='image'
              render={({ field: { value, onChange }, fieldState }) => {
                const existingImageUrl = isEdit ? currentRow?.image_url : null
                const hasNewImage =
                  value instanceof File ||
                  (Array.isArray(value) && value.length > 0)

                return (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='col-span-1 mt-2 md:col-span-2'
                  >
                    <FieldLabel>Profile Picture</FieldLabel>
                    <FileUpload
                      value={value}
                      onValueChange={onChange}
                      accept='image/*'
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, m) =>
                        form.setError('image', { message: m })
                      }
                    >
                      <FileUploadDropzone className='flex-row flex-wrap border-dotted text-center'>
                        <HugeiconsIcon
                          icon={CloudUploadIcon}
                          className='size-4'
                        />
                        Drag and drop or
                        <FileUploadTrigger asChild>
                          <Button variant='link' size='sm' className='p-0'>
                            choose file
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {existingImageUrl && !hasNewImage && (
                          <FileUploadItem
                            value={createDummyFile('Current Profile Image')}
                            className='w-full'
                          >
                            <div className='flex size-8 items-center justify-center rounded-md bg-muted overflow-hidden relative border'>
                              <Image
                                src={existingImageUrl}
                                alt='Current Profile'
                                fill
                                className='object-cover'
                                unoptimized
                              />
                            </div>
                            <FileUploadItemMetadata className='ml-2 flex-1' />
                            {/* We don't provide a delete button for existing image as it's managed by upload replacement */}
                          </FileUploadItem>
                        )}
                        {value?.map((file: File, i: number) => (
                          <FileUploadItem key={i} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button variant='ghost' size='icon'>
                                <HugeiconsIcon
                                  icon={CancelCircleIcon}
                                  className='size-4'
                                />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </div>

        {/* --- SECTION 2: PROFILE & FINANCIAL --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          {/* ... (Profile fields remain unchanged) ... */}
          <div className='mb-4 border-b pb-2'>
            <h3 className='text-lg font-semibold'>
              Profile & Financial Details
            </h3>
            <p className='text-sm text-muted-foreground'>
              Demographics, tax, and banking info.
            </p>
          </div>
          <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              control={form.control}
              name='profile.date_of_birth'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Date of Birth</FieldLabel>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) =>
                      field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                    }
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.gender'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Gender</FieldLabel>
                  <Combobox
                    items={genderOptions}
                    itemToStringLabel={(item) => item.label}
                    value={
                      genderOptions.find((g) => g.value === field.value) ?? null
                    }
                    onValueChange={(item) =>
                      field.onChange(item?.value ?? null)
                    }
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput placeholder='Select Gender' showClear />
                    <ComboboxContent>
                      <ComboboxEmpty>No gender found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.marital_status'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Marital Status</FieldLabel>
                  <Combobox
                    items={maritalStatusOptions}
                    itemToStringLabel={(item) => item.label}
                    value={
                      maritalStatusOptions.find(
                        (m) => m.value === field.value
                      ) ?? null
                    }
                    onValueChange={(item) =>
                      field.onChange(item?.value ?? null)
                    }
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput placeholder='Select Status' showClear />
                    <ComboboxContent>
                      <ComboboxEmpty>No status found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.national_id'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>National ID / SSN</FieldLabel>
                  <Input
                    placeholder='ID Number'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.tax_number'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Tax Number</FieldLabel>
                  <Input
                    placeholder='Tax Reference'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.bank_name'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Bank Name</FieldLabel>
                  <Input
                    placeholder='Bank Name'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='profile.account_number'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Account Number</FieldLabel>
                  <Input
                    placeholder='Account No.'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* --- SECTION 3: JOB DETAILS --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          {/* ... (Job fields remain unchanged) ... */}
          <div className='mb-4 border-b pb-2'>
            <h3 className='text-lg font-semibold'>Job Details</h3>
            <p className='text-sm text-muted-foreground'>
              Department, role, and compensation.
            </p>
          </div>
          <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              control={form.control}
              name='department_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>
                    Department <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <div className='flex items-center gap-2'>
                    <Combobox
                      items={optionDepartments || []}
                      itemToStringLabel={(i) => i.label}
                      value={
                        (optionDepartments || []).find(
                          (d) => d.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) => {
                        field.onChange(item?.value ?? null)
                        form.setValue('designation_id', 0)
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingDepartments
                            ? 'Loading...'
                            : 'Select Department'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No department found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {canCreateDepartment && (
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        onClick={() => setIsDepartmentOpen(true)}
                      >
                        <HugeiconsIcon icon={PlusSignIcon} className='size-4' />
                      </Button>
                    )}
                  </div>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='designation_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>
                    Designation <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <div className='flex items-center gap-2'>
                    <Combobox
                      items={optionDesignations || []}
                      itemToStringLabel={(i) => i.label}
                      value={
                        (optionDesignations || []).find(
                          (d) => d.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) => {
                        field.onChange(item?.value ?? null)
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                      disabled={!departmentId}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingDesignations
                            ? 'Loading...'
                            : 'Select Designation'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No designation found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {canCreateDesignation && (
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        onClick={() => setIsDesignationOpen(true)}
                      >
                        <HugeiconsIcon icon={PlusSignIcon} className='size-4' />
                      </Button>
                    )}
                  </div>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='shift_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>
                    Shift <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <div className='flex items-center gap-2'>
                    <Combobox
                      items={optionShifts || []}
                      itemToStringLabel={(i) => i.label}
                      value={
                        (optionShifts || []).find(
                          (s) => s.value === field.value
                        ) ?? null
                      }
                      onValueChange={(item) => {
                        field.onChange(item?.value ?? null)
                      }}
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxInput
                        placeholder={
                          isLoadingShifts ? 'Loading...' : 'Select Shift'
                        }
                        showClear
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No shift found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {canCreateShift && (
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        onClick={() => setIsShiftOpen(true)}
                      >
                        <HugeiconsIcon icon={PlusSignIcon} className='size-4' />
                      </Button>
                    )}
                  </div>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='employment_type_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>
                    Employment Type <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Combobox
                    items={optionEmploymentTypes || []}
                    itemToStringLabel={(i) => i.label}
                    value={
                      (optionEmploymentTypes || []).find(
                        (e) => e.value === field.value
                      ) ?? null
                    }
                    onValueChange={(item) => {
                      field.onChange(item?.value ?? null)
                    }}
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput
                      placeholder={
                        isLoadingEmploymentTypes
                          ? 'Loading...'
                          : 'Select Employment Type'
                      }
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No employment type found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='basic_salary'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    Basic Salary <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Input
                    type='number'
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='joining_date'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Joining Date</FieldLabel>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) =>
                      field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                    }
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='confirmation_date'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Confirmation Date</FieldLabel>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) =>
                      field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                    }
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='probation_end_date'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Probation End Date</FieldLabel>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) =>
                      field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                    }
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='reporting_manager_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Reporting Manager</FieldLabel>
                  <Combobox
                    items={optionEmployees || []}
                    itemToStringLabel={(i) => i.label}
                    value={
                      (optionEmployees || []).find(
                        (e) => e.value === field.value
                      ) ?? null
                    }
                    onValueChange={(item) => {
                      field.onChange(item?.value ?? null)
                    }}
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput
                      placeholder={
                        isLoadingEmployees ? 'Loading...' : 'Select Manager'
                      }
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No employee found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='warehouse_id'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='flex flex-col'
                >
                  <FieldLabel>Warehouse</FieldLabel>
                  <Combobox
                    items={optionWarehouses || []}
                    itemToStringLabel={(i) => i.label}
                    value={
                      (optionWarehouses || []).find(
                        (w) => w.value === field.value
                      ) ?? null
                    }
                    onValueChange={(item) => {
                      field.onChange(item?.value ?? null)
                    }}
                    isItemEqualToValue={(a, b) => a?.value === b?.value}
                  >
                    <ComboboxInput
                      placeholder={
                        isLoadingWarehouses ? 'Loading...' : 'Select Warehouse'
                      }
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No warehouse found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='is_active'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className='col-span-1 flex flex-row items-center justify-between rounded-md border p-4 md:col-span-2'
                >
                  <div className='space-y-0.5'>
                    <FieldLabel>Active Status</FieldLabel>
                    <FieldDescription>
                      Is this employee currently active?
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* --- SECTION 4: SYSTEM ACCESS --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          <div className='mb-4 border-b pb-2'>
            <h3 className='text-lg font-semibold'>System Access</h3>
            <p className='text-sm text-muted-foreground'>
              App access credentials and roles.
            </p>
          </div>
          <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              control={form.control}
              name='user.username'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    placeholder='Unique username'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='user.password'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    {isEdit
                      ? 'New Password (Leave blank to keep current)'
                      : 'Password'}
                  </FieldLabel>
                  <Input
                    type='password'
                    placeholder='Secure password'
                    {...field}
                    value={field.value || ''}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='user.roles'
              render={({ field, fieldState }) => {
                const selectedItems = field.value
                  ? field.value
                      .map((id) => optionRoles?.find((opt) => opt.value === id))
                      .filter(
                        (
                          opt
                        ): opt is {
                          value: number
                          label: string
                        } => !!opt
                      )
                  : []
                return (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='col-span-1 flex flex-col md:col-span-2'
                  >
                    <FieldLabel>Roles</FieldLabel>
                    <Combobox
                      multiple
                      items={optionRoles || []}
                      itemToStringLabel={(item) => item.label}
                      value={selectedItems}
                      onValueChange={(items) =>
                        field.onChange(items.map((i) => i.value))
                      }
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxChips ref={rolesAnchor}>
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((item: RoleOption) => (
                                <ComboboxChip key={item.value}>
                                  {item.label}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                placeholder={
                                  isLoadingRoles
                                    ? 'Loading...'
                                    : 'Assign roles...'
                                }
                              />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={rolesAnchor}>
                        <ComboboxInput
                          placeholder='Search roles...'
                        >
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-xs'
                            title='Select All'
                            onClick={() => {
                              const allIds = optionRoles?.map((r) => r.value) || []
                              field.onChange(allIds)
                            }}
                          >
                            <HugeiconsIcon icon={Tick02Icon} className='size-4' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-xs'
                            title='Clear All'
                            onClick={() => field.onChange([])}
                          >
                            <HugeiconsIcon icon={Cancel01Icon} className='size-4' />
                          </Button>
                        </ComboboxInput>
                        <ComboboxEmpty>No roles found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Controller
              control={form.control}
              name='user.permissions'
              render={({ field, fieldState }) => {
                const selectedItems = field.value
                  ? field.value
                      .map((id) =>
                        optionPermissions?.find((opt) => opt.value === id)
                      )
                      .filter(
                        (
                          opt
                        ): opt is {
                          value: number
                          label: string
                        } => !!opt
                      )
                  : []
                return (
                  <Field
                    data-invalid={!!fieldState.error}
                    className='col-span-1 flex flex-col md:col-span-2'
                  >
                    <FieldLabel>Permissions</FieldLabel>
                    <Combobox
                      multiple
                      items={optionPermissions || []}
                      itemToStringLabel={(item) => item.label}
                      value={selectedItems}
                      onValueChange={(items) =>
                        field.onChange(items.map((i) => i.value))
                      }
                      isItemEqualToValue={(a, b) => a?.value === b?.value}
                    >
                      <ComboboxChips ref={permissionsAnchor}>
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((item: PermissionOption) => (
                                <ComboboxChip key={item.value}>
                                  {item.label}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                placeholder={
                                  isLoadingPermissions
                                    ? 'Loading...'
                                    : 'Assign permissions...'
                                }
                              />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={permissionsAnchor}>
                        <ComboboxInput
                          placeholder='Search permissions...'
                        >
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-xs'
                            title='Select All'
                            onClick={() => {
                              const allIds = optionPermissions?.map((p) => p.value) || []
                              field.onChange(allIds)
                            }}
                          >
                            <HugeiconsIcon icon={Tick02Icon} className='size-4' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-xs'
                            title='Clear All'
                            onClick={() => field.onChange([])}
                          >
                            <HugeiconsIcon icon={Cancel01Icon} className='size-4' />
                          </Button>
                        </ComboboxInput>
                        <ComboboxEmpty>No permissions found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </div>

        {/* --- SECTION 5: SALES & COMMISSION --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          {/* ... (Sales fields remain unchanged) ... */}
          <div className='mb-4 border-b pb-2'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold'>Sales & Commission</h3>
                <p className='text-sm text-muted-foreground'>
                  Configure sales targets and tier commissions.
                </p>
              </div>
              <Controller
                control={form.control}
                name='is_sale_agent'
                render={({ field }) => (
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-medium'>
                      Enable Sales Tracking
                    </span>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {isSaleAgent && (
            <FieldGroup className='grid gap-4'>
              <Controller
                control={form.control}
                name='sale_commission_percent'
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className='max-w-xs'>
                    <FieldLabel>Base Commission (%)</FieldLabel>
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      step={0.01}
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className='space-y-3 rounded-md border bg-muted/20 p-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <h4 className='text-sm font-semibold'>Sales Target Tiers</h4>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      appendSalesTarget({
                        sales_from: 0,
                        sales_to: 0,
                        percent: 0,
                      })
                    }
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className='mr-2 size-4'
                    />{' '}
                    Add Tier
                  </Button>
                </div>
                {salesTargets.map((field, index) => (
                  <div
                    key={field.id}
                    className='grid grid-cols-12 items-end gap-3'
                  >
                    <div className='col-span-4'>
                      <Controller
                        control={form.control}
                        name={`sales_target.${index}.sales_from`}
                        render={({ field: f }) => (
                          <Field>
                            {index === 0 && (
                              <FieldLabel className='text-xs'>
                                From Amount
                              </FieldLabel>
                            )}
                            <Input
                              type='number'
                              min={0}
                              {...f}
                              onChange={(e) =>
                                f.onChange(Number(e.target.value))
                              }
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className='col-span-4'>
                      <Controller
                        control={form.control}
                        name={`sales_target.${index}.sales_to`}
                        render={({ field: f }) => (
                          <Field>
                            {index === 0 && (
                              <FieldLabel className='text-xs'>
                                To Amount
                              </FieldLabel>
                            )}
                            <Input
                              type='number'
                              min={0}
                              {...f}
                              onChange={(e) =>
                                f.onChange(Number(e.target.value))
                              }
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className='col-span-3'>
                      <Controller
                        control={form.control}
                        name={`sales_target.${index}.percent`}
                        render={({ field: f }) => (
                          <Field>
                            {index === 0 && (
                              <FieldLabel className='text-xs'>
                                Percent (%)
                              </FieldLabel>
                            )}
                            <Input
                              type='number'
                              min={0}
                              max={100}
                              step='0.01'
                              {...f}
                              onChange={(e) =>
                                f.onChange(Number(e.target.value))
                              }
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className='col-span-1 flex justify-end pb-1'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                        onClick={() => removeSalesTarget(index)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className='size-4' />
                      </Button>
                    </div>
                  </div>
                ))}
                {form.formState.errors.sales_target && (
                  <p className='text-sm font-medium text-destructive'>
                    {form.formState.errors.sales_target.root?.message}
                  </p>
                )}
              </div>
            </FieldGroup>
          )}
        </div>

        {/* --- SECTION 6: DOCUMENTS --- */}
        <div className='space-y-4 rounded-xl border bg-card p-4'>
          <div className='mb-4 flex items-center justify-between border-b pb-2'>
            <div>
              <h3 className='text-lg font-semibold'>Documents</h3>
              <p className='text-sm text-muted-foreground'>
                Upload IDs, contracts, and certifications.
              </p>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                appendDocument({
                  document_type_id: 0,
                  name: '',
                  notes: '',
                  issue_date: '',
                  expiry_date: '',
                  file: [],
                })
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} className='mr-2 size-4' /> Add
              Document
            </Button>
          </div>

          <div className='space-y-6'>
            {documents.length === 0 && (
              <div className='rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground italic'>
                No documents added. Click "Add Document" to attach files.
              </div>
            )}
            {documents.map((docField, index) => {
              const selectedTypeId = form.watch(
                `documents.${index}.document_type_id`
              )
              const selectedType = optionDocumentTypes?.find(
                (t) => t.value === selectedTypeId
              )
              const isEditDocMode = isEdit && !!docField.id
              const existingDocUrl = (docField as any).file_url
              const hasNewFile =
                Array.isArray(form.watch(`documents.${index}.file`)) &&
                form.watch(`documents.${index}.file`).length > 0

              return (
                <div
                  key={docField.id}
                  className='relative rounded-md border bg-muted/10 p-4'
                >
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => removeDocument(index)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className='size-4' />
                    </Button>
                  </div>
                  <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Controller
                      control={form.control}
                      name={`documents.${index}.document_type_id`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={!!fieldState.error}
                          className='flex flex-col'
                        >
                          <FieldLabel>
                            Document Type{' '}
                            <span className='text-destructive'>*</span>
                          </FieldLabel>
                          <Combobox
                            items={
                              optionDocumentTypes?.filter(
                                (type) =>
                                  !selectedDocumentTypeIds.includes(
                                    type.value
                                  ) || type.value === field.value
                              ) || []
                            }
                            itemToStringLabel={(i) => i.label}
                            value={
                              (optionDocumentTypes || []).find(
                                (d) => d.value === field.value
                              ) ?? null
                            }
                            onValueChange={(i) => field.onChange(i?.value ?? 0)}
                          >
                            <ComboboxInput
                              placeholder={
                                isLoadingDocumentTypes
                                  ? 'Loading...'
                                  : 'Select Type'
                              }
                            />
                            <ComboboxContent>
                              <ComboboxEmpty>No match.</ComboboxEmpty>
                              <ComboboxList>
                                {(i) => (
                                  <ComboboxItem key={i.value} value={i}>
                                    {i.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`documents.${index}.name`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>Document Name</FieldLabel>
                          <Input
                            placeholder='e.g. Identity Card Scanned'
                            {...field}
                            value={field.value || ''}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`documents.${index}.issue_date`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={!!fieldState.error}
                          className='flex flex-col'
                        >
                          <FieldLabel>Issue Date</FieldLabel>
                          <DatePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(d) =>
                              field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                            }
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {selectedType?.requires_expiry && (
                      <Controller
                        control={form.control}
                        name={`documents.${index}.expiry_date`}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={!!fieldState.error}
                            className='flex flex-col'
                          >
                            <FieldLabel>Expiry Date</FieldLabel>
                            <DatePicker
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              onChange={(d) =>
                                field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                              }
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    )}

                    <Controller
                      control={form.control}
                      name={`documents.${index}.notes`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={!!fieldState.error}
                          className='md:col-span-2'
                        >
                          <FieldLabel>Notes</FieldLabel>
                          <Textarea
                            placeholder='Any notes...'
                            className='h-16 resize-none'
                            {...field}
                            value={field.value || ''}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`documents.${index}.file`}
                      render={({ field: { value, onChange }, fieldState }) => {
                        return (
                          <Field
                            data-invalid={!!fieldState.error}
                            className='col-span-1 md:col-span-2'
                          >
                            <FieldLabel>
                              File Upload{' '}
                              {isEditDocMode && !hasNewFile && (
                                <span className='ml-2 font-normal text-muted-foreground'>
                                  (Existing file is kept unless replaced)
                                </span>
                              )}
                            </FieldLabel>
                            <FileUpload
                              value={value}
                              onValueChange={onChange}
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024}
                            >
                              <FileUploadDropzone className='flex-row flex-wrap border-dotted py-4 text-center'>
                                <HugeiconsIcon
                                  icon={CloudUploadIcon}
                                  className='size-4'
                                />
                                Drag and drop or
                                <FileUploadTrigger asChild>
                                  <Button
                                    variant='link'
                                    size='sm'
                                    className='p-0'
                                  >
                                    choose file
                                  </Button>
                                </FileUploadTrigger>
                              </FileUploadDropzone>
                              <FileUploadList>
                                {existingDocUrl && !hasNewFile && (
                                  <FileUploadItem
                                    value={createDummyFile(
                                      'Current Document File'
                                    )}
                                    className='w-full'
                                  >
                                    <div className='flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                      <HugeiconsIcon
                                        icon={File02Icon}
                                        className='size-4'
                                      />
                                    </div>
                                    <FileUploadItemMetadata className='ml-2 flex-1' />
                                  </FileUploadItem>
                                )}
                                {value?.map((file: File, i: number) => (
                                  <FileUploadItem
                                    key={i}
                                    value={file}
                                    className='w-full'
                                  >
                                    <div className='flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                      <HugeiconsIcon
                                        icon={File02Icon}
                                        className='size-4'
                                      />
                                    </div>
                                    <FileUploadItemPreview className='hidden' />
                                    <FileUploadItemMetadata className='ml-2 flex-1' />
                                    <FileUploadItemDelete asChild>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='size-7 text-muted-foreground hover:text-destructive'
                                      >
                                        <HugeiconsIcon
                                          icon={CancelCircleIcon}
                                          className='size-4'
                                        />
                                      </Button>
                                    </FileUploadItemDelete>
                                  </FileUploadItem>
                                ))}
                              </FileUploadList>
                            </FileUpload>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </form>

      <DepartmentsActionDialog
        open={isDepartmentOpen}
        onOpenChange={setIsDepartmentOpen}
      />
      <DesignationsActionDialog
        open={isDesignationOpen}
        onOpenChange={setIsDesignationOpen}
      />
      <ShiftsActionDialog open={isShiftOpen} onOpenChange={setIsShiftOpen} />
    </>
  )
}
