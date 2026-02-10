'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { CloudUploadIcon, File02Icon, CancelCircleIcon } from '@hugeicons/core-free-icons'
import { useCustomersImport } from '../api'
import { customerImportSchema, type CustomerImportFormData } from '../schemas'
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
import { useMediaQuery } from '@/hooks/use-media-query'

type CustomersImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersImportDialog({
  open,
  onOpenChange,
}: CustomersImportDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: importCustomers, isPending } = useCustomersImport()

  const form = useForm<CustomerImportFormData>({
    resolver: zodResolver(customerImportSchema),
    defaultValues: { file: [] },
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  const onSubmit = (data: CustomerImportFormData) => {
    const file = data.file[0]
    if (file) {
      importCustomers(file, {
        onSuccess: () => {
          handleOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const content = (
    <form
      id="customers-import-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
    >
      <div className="space-y-2 rounded-md border bg-muted/50 p-3 text-sm">
        <div className="font-medium">Required: name</div>
        <div className="text-muted-foreground">
          Optional: company_name, email, phone_number, wa_number, address, city, state, postal_code, country, opening_balance, credit_limit, etc.
        </div>
      </div>
      <FieldGroup>
        <Controller
          control={form.control}
          name="file"
          render={({ field: { value, onChange }, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Upload File</FieldLabel>
              <FileUpload
                value={value}
                onValueChange={onChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                onFileReject={(_, message) => {
                  form.setError('file', { message })
                }}
              >
                <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={CloudUploadIcon} className="size-5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    <br />
                    <span className="text-muted-foreground">CSV or Excel (max 5MB)</span>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="link" size="sm" className="sr-only">
                      Select file
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {value?.map((file, index) => (
                    <FileUploadItem key={index} value={file} className="w-full">
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <HugeiconsIcon icon={File02Icon} className="size-4" />
                      </div>
                      <FileUploadItemPreview className="hidden" />
                      <FileUploadItemMetadata className="ml-2 flex-1" />
                      <FileUploadItemDelete asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                        >
                          <HugeiconsIcon icon={CancelCircleIcon} className="size-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
              <FieldDescription>Upload CSV or Excel with customer data.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle>Import Customers</DialogTitle>
            <DialogDescription>
              Bulk create customers by uploading a CSV or Excel file.
            </DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="customers-import-form"
              disabled={!form.formState.isValid || isPending}
            >
              {isPending ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Import Customers</DrawerTitle>
          <DrawerDescription>
            Bulk create customers by uploading a CSV or Excel file.
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">{content}</div>
        <DrawerFooter>
          <Button
            type="submit"
            form="customers-import-form"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? 'Importing...' : 'Import'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
