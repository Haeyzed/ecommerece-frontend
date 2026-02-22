'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

import {
  useCreateLanguage,
  useUpdateLanguage,
} from '@/features/settings/languages/api'
import { languageSchema, type LanguageFormData } from '@/features/settings/languages/schemas'
import { type Language } from '../types'

import { useMediaQuery } from '@/hooks/use-media-query'
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type LanguagesActionDialogProps = {
  currentRow?: Language
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LanguagesActionDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: LanguagesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createLanguage, isPending: isCreating } = useCreateLanguage()
  const { mutate: updateLanguage, isPending: isUpdating } = useUpdateLanguage()
  const isLoading = isCreating || isUpdating

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        code: currentRow.code,
        name_native: currentRow.name_native ?? '',
        dir: currentRow.dir ?? 'ltr',
      }
      : {
        name: '',
        code: '',
        name_native: '',
        dir: 'ltr',
      },
  })

  const onSubmit = (values: LanguageFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateLanguage({ id: currentRow.id, data: values }, options)
    } else {
      createLanguage(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit Language' : 'Add New Language'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the language details here. ' : 'Create a new language here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <LanguageForm form={form} onSubmit={onSubmit} id='language-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='language-form' disabled={isLoading}>
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
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{isEdit ? 'Edit Language' : 'Add New Language'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the language details here. ' : 'Create a new language here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <LanguageForm form={form} onSubmit={onSubmit} id='language-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='language-form' disabled={isLoading}>
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

interface LanguageFormProps {
  form: UseFormReturn<LanguageFormData>
  onSubmit: (data: LanguageFormData) => void
  id: string
  className?: string
}

function LanguageForm({ form, onSubmit, id, className }: LanguageFormProps) {
  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='language-name'>Name <span className='text-destructive'>*</span></FieldLabel>
                <Input id='language-name' placeholder='English' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='language-code'>Code <span className='text-destructive'>*</span></FieldLabel>
                <Input id='language-code' placeholder='en' maxLength={2} className="lowercase" autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='name_native'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='language-name-native'>Native Name</FieldLabel>
                <Input id='language-name-native' placeholder='English' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='dir'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='language-dir'>Text Direction</FieldLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id='language-dir'>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                    <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  )
}