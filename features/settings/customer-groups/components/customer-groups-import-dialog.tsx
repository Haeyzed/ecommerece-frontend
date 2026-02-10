'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { CloudUploadIcon, File02Icon, CancelCircleIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { useCustomerGroupsImport } from '../api'
import { customerGroupImportSchema, type CustomerGroupImportFormData } from '../schemas'
import { SAMPLE_CUSTOMER_GROUPS_CSV } from '../constants'
import { downloadSampleAsCsv } from '@/lib/download-sample-csv'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from '@/components/ui/file-upload'
import { useMediaQuery } from '@/hooks/use-media-query'

type Props = { open: boolean; onOpenChange: (o: boolean) => void }

export function CustomerGroupsImportDialog({ open, onOpenChange }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: importGroups, isPending } = useCustomerGroupsImport()
  const form = useForm<CustomerGroupImportFormData>({ resolver: zodResolver(customerGroupImportSchema), defaultValues: { file: [] } })
  const handleOpenChange = (v: boolean) => { if (!v) form.reset(); onOpenChange(v) }
  const onSubmit = (data: CustomerGroupImportFormData) => {
    const file = data.file[0]
    if (file) importGroups(file, { onSuccess: () => { handleOpenChange(false); form.reset() } })
  }
  const content = (
    <form id="cg-import-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <Button type="button" variant="outline" size="sm" onClick={() => downloadSampleAsCsv(SAMPLE_CUSTOMER_GROUPS_CSV, 'sample_customer_groups.csv')}>
        <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" /> Download Sample CSV
      </Button>
      <p className="text-sm text-muted-foreground">Columns: name*, percentage*</p>
      <Controller control={form.control} name="file" render={({ field: { value, onChange }, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel>Upload File</FieldLabel>
          <FileUpload value={value} onValueChange={onChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" maxFiles={1} maxSize={5 * 1024 * 1024} onFileReject={(_, msg) => form.setError('file', { message: msg })}>
            <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
              <HugeiconsIcon icon={CloudUploadIcon} className="size-10 rounded-lg bg-muted p-2" />
              <span className="text-sm font-semibold text-primary">Click to upload</span> or drag and drop. CSV or Excel (max 5MB)
              <FileUploadTrigger asChild><Button variant="link" size="sm" className="sr-only">Select</Button></FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {value?.map((file, i) => (
                <FileUploadItem key={i} value={file} className="w-full">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10"><HugeiconsIcon icon={File02Icon} className="size-4" /></div>
                  <FileUploadItemPreview className="hidden" />
                  <FileUploadItemMetadata className="ml-2 flex-1" />
                  <FileUploadItemDelete asChild><Button variant="ghost" size="icon" className="size-7"><HugeiconsIcon icon={CancelCircleIcon} className="size-4" /></Button></FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )} />
    </form>
  )
  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-start"><DialogTitle>Import Customer Groups</DialogTitle><DialogDescription>Bulk create from CSV or Excel.</DialogDescription></DialogHeader>
          {content}
          <DialogFooter><Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button><Button type="submit" form="cg-import-form" disabled={!form.formState.isValid || isPending}>{isPending ? 'Importing...' : 'Import'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    )
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left"><DrawerTitle>Import Customer Groups</DrawerTitle><DrawerDescription>Bulk create from CSV or Excel.</DrawerDescription></DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter><Button type="submit" form="cg-import-form" disabled={!form.formState.isValid || isPending}>{isPending ? 'Importing...' : 'Import'}</Button><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
