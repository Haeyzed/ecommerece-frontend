'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CloudUploadIcon,
  Download01Icon,
  File02Icon,
  ViewIcon,
  CancelCircleIcon,
} from '@hugeicons/core-free-icons'

import { useSuppliersImport } from '../api'
import { supplierImportSchema, type SupplierImportFormData } from '../schemas'
import { downloadSampleAsCsv } from '@/lib/download-sample-csv'
import { SAMPLE_SUPPLIERS_CSV } from '../constants'
import { SuppliersCsvPreviewDialog } from './suppliers-csv-preview-dialog'

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

type SuppliersImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SuppliersImportDialog({
  open,
  onOpenChange,
}: SuppliersImportDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { mutate: importSuppliers, isPending } = useSuppliersImport()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([])

  const form = useForm<SupplierImportFormData>({
    resolver: zodResolver(supplierImportSchema),
    defaultValues: { file: [] },
  })

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter((l) => l.trim() !== '')
    const headers = lines[0].split(',').map((h) => h.trim())
    return lines.slice(1).map((line) => {
      const values = line.split(',')
      return headers.reduce((obj, h, i) => {
        obj[h] = values[i]?.trim() ?? ''
        return obj
      }, {} as Record<string, string>)
    })
  }

  const handlePreview = (data: SupplierImportFormData) => {
    const file = data.file[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = (e.target?.result as string) ?? ''
        setPreviewData(parseCSV(text))
        setPreviewOpen(true)
      }
      reader.readAsText(file)
    }
  }

  const handleConfirmImport = () => {
    const file = form.getValues().file[0]
    if (file) {
      importSuppliers(file, {
        onSuccess: () => {
          setPreviewOpen(false)
          handleOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const handleDownloadSample = () => {
    downloadSampleAsCsv(SAMPLE_SUPPLIERS_CSV, 'suppliers_sample.csv')
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      form.reset()
      setPreviewOpen(false)
    }
    onOpenChange(value)
  }

  const ImportContent = () => (
    <form
      id="suppliers-import-form"
      onSubmit={form.handleSubmit(handlePreview)}
      className="grid gap-4 py-4"
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadSample}
          className="text-muted-foreground"
        >
          <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />
          Download Sample CSV
        </Button>
      </div>
      <FieldGroup>
        <div className="space-y-2 rounded-md border bg-muted/50 p-3 text-sm">
          <div className="font-medium">Required: name. Optional: company_name, vat_number, email, phone_number, wa_number, address, city, state, postal_code, country, opening_balance</div>
        </div>
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
                onFileReject={(_, msg) => form.setError('file', { message: msg })}
              >
                <FileUploadDropzone className="flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
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
                  {value?.map((file, i) => (
                    <FileUploadItem key={i} value={file} className="w-full">
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
              <FieldDescription>Upload the file containing your supplier data.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-start">
            <DialogTitle>Import Suppliers</DialogTitle>
            <DialogDescription>
              Bulk create suppliers by uploading a CSV or Excel file.
            </DialogDescription>
            </DialogHeader>
            <ImportContent />
            <DialogFooter className="gap-y-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" form="suppliers-import-form" disabled={!form.formState.isValid}>
                Preview Data
                <HugeiconsIcon icon={ViewIcon} strokeWidth={2} className="ml-2 size-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <DrawerHeader className="text-left">
            <DrawerTitle>Import Suppliers</DrawerTitle>
            <DrawerDescription>
              Bulk create suppliers by uploading a CSV or Excel file.
            </DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <ImportContent />
            </div>
            <DrawerFooter>
              <Button type="submit" form="suppliers-import-form" disabled={!form.formState.isValid}>
                Preview Data
                <HugeiconsIcon icon={ViewIcon} strokeWidth={2} className="ml-2 size-4" />
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      <SuppliersCsvPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
        onConfirm={handleConfirmImport}
        isPending={isPending}
      />
    </>
  )
}
