'use client'

/**
 * BrandsImportDialog
 *
 * A dialog/drawer component for bulk importing brands via file upload (CSV/Excel).
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Controls visibility
 * @param {function} props.onOpenChange - Callback for visibility changes
 */

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { useBrandsImport } from '@/features/products/brands/api'
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
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMediaQuery } from "@/hooks/use-media-query"

type BrandsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsImportDialog({
  open,
  onOpenChange,
}: BrandsImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const { mutate: importBrands, isPending } = useBrandsImport()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (file) {
      importBrands(file, {
        onSuccess: () => {
          handleOpenChange(false)
        },
      })
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) setFile(null)
    onOpenChange(value)
  }

  const ImportForm = () => (
    <div className="grid gap-4 py-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="import-file">File</FieldLabel>
          <Input 
            id="import-file" 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv,.xlsx" 
          />
        </Field>
      </FieldGroup>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='text-start'>
            <DialogTitle>
              Import Brands
            </DialogTitle>
            <DialogDescription>
              Import brands from a CSV or Excel file.
            </DialogDescription>
          </DialogHeader>
          
          <ImportForm />

          <DialogFooter className='gap-y-2'>
            <Button variant='outline' onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isPending}>
              Import <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="ml-2 size-4" />
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
          <DrawerTitle>
            Import Brands
          </DrawerTitle>
          <DrawerDescription>
            Import brands from a CSV or Excel file.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="no-scrollbar overflow-y-auto px-4">
          <ImportForm />
        </div>

        <DrawerFooter>
          <Button onClick={handleImport} disabled={!file || isPending}>
            Import <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="ml-2 size-4" />
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}