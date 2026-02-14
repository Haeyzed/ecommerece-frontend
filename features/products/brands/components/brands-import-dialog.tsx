'use client'

/**
 * BrandsImportDialog
 *
 * A dialog/drawer component for bulk importing brands via file upload (CSV/Excel).
 * Handles file selection, CSV parsing for preview, and final submission.
 */

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CloudUploadIcon,
  Download01Icon,
  File02Icon,
  ViewIcon,
  CancelCircleIcon
} from '@hugeicons/core-free-icons'

import { useBrandsImport, useBrandsTemplateDownload } from '@/features/products/brands/api'
import { brandImportSchema, type BrandImportFormData } from '@/features/products/brands/schemas'
import { BrandsCsvPreviewDialog } from './brands-csv-preview-dialog'

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
} from "@/components/ui/drawer"
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
import { useMediaQuery } from "@/hooks/use-media-query"
import { Spinner } from '@/components/ui/spinner'

type BrandsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsImportDialog({
                                     open,
                                     onOpenChange,
                                   }: BrandsImportDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { mutate: importBrands, isPending } = useBrandsImport()

  const { mutate: downloadTemplate, isPending: isDownloading } = useBrandsTemplateDownload()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  const form = useForm<BrandImportFormData>({
    resolver: zodResolver(brandImportSchema),
    defaultValues: {
      file: [],
    },
  })

  // Simple CSV Parser for preview
  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '')
    const headers = lines[0].split(',').map(h => h.trim())
    return lines.slice(1).map(line => {
      const values = line.split(',')
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i]?.trim()
        return obj
      }, {} as Record<string, string>)
    })
  }

  const handlePreview = (data: BrandImportFormData) => {
    const file = data.file[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const parsed = parseCSV(text)
        setPreviewData(parsed)
        setPreviewOpen(true)
      }
      reader.readAsText(file)
    }
  }

  const handleConfirmImport = () => {
    const file = form.getValues().file[0]
    if (file) {
      importBrands(file, {
        onSuccess: () => {
          setPreviewOpen(false)
          handleOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const handleDownloadSample = () => {
    downloadTemplate()
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      form.reset()
      setPreviewOpen(false)
    }
    onOpenChange(value)
  }

  const ImportContent = () => (
    <form id='import-form' onSubmit={form.handleSubmit(handlePreview)} className="grid gap-4 py-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadSample}
          disabled={isDownloading}
          className="text-muted-foreground"
        >
          {isDownloading ? (
            <>
              <Spinner className="mr-2 size-4" />
              Downloading...
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={Download01Icon}
                className={'mr-2 size-4'}
              />
              Download Sample CSV
            </>
          )}
        </Button>
      </div>

      <FieldGroup>
        <div className='space-y-2 rounded-md border bg-muted/50 p-3 text-sm'>
          <div className='font-medium'>Required Fields:</div>
          <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
            <li><code className='rounded bg-background px-1 py-0.5 text-xs'>name*</code> - Brand name (required)</li>
          </ul>
          <div className='font-medium mt-3'>Optional Fields:</div>
          <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
            <li><code className='rounded bg-background px-1 py-0.5 text-xs'>short_description</code> - Brand description</li>
            <li><code className='rounded bg-background px-1 py-0.5 text-xs'>image_url</code> - Image URL</li>
            <li><code className='rounded bg-background px-1 py-0.5 text-xs'>page_title</code> - Page title</li>
          </ul>
        </div>
        <Controller
          control={form.control}
          name='file'
          render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='import-file'>Upload File</FieldLabel>

              <FileUpload
                value={value}
                onValueChange={onChange}
                accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                maxFiles={1}
                maxSize={5 * 1024 * 1024} // 5MB
                onFileReject={(_, message) => {
                  form.setError('file', { message })
                }}
              >
                <FileUploadDropzone className='flex-col items-center justify-center gap-2 border-dashed p-8 text-center'>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={CloudUploadIcon} className='size-5' />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">Click to upload</span>
                    {" "}or drag and drop
                    <br />
                    <span className="text-muted-foreground">CSV or Excel (max 5MB)</span>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant='link' size='sm' className='sr-only'>
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
                          variant='ghost'
                          size='icon'
                          className='size-7 text-muted-foreground hover:text-destructive'
                        >
                          <HugeiconsIcon icon={CancelCircleIcon} className='size-4' />
                          <span className='sr-only'>Remove</span>
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>

              <FieldDescription>
                Upload the file containing your brand data.
              </FieldDescription>
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
          <DialogContent className='sm:max-w-md'>
            <DialogHeader className='text-start'>
              <DialogTitle>Import Brands</DialogTitle>
              <DialogDescription>
                Bulk create brands by uploading a CSV or Excel file.
              </DialogDescription>
            </DialogHeader>

            <ImportContent />

            <DialogFooter className='gap-y-2'>
              <Button variant='outline' onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" form="import-form" disabled={!form.formState.isValid || isPending}>
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
              <DrawerTitle>Import Brands</DrawerTitle>
              <DrawerDescription>
                Bulk create brands by uploading a CSV or Excel file.
              </DrawerDescription>
            </DrawerHeader>

            <div className="no-scrollbar overflow-y-auto px-4">
              <ImportContent />
            </div>

            <DrawerFooter>
              <Button type="submit" form="import-form" disabled={!form.formState.isValid || isPending}>
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

      <BrandsCsvPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
        onConfirm={handleConfirmImport}
        isPending={isPending}
      />
    </>
  )
}