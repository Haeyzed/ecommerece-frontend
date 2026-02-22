'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import { EmojiPicker } from '@ferrucc-io/emoji-picker'

import {
  useCreateCountry,
  useUpdateCountry,
} from '@/features/settings/countries/api'
import { countrySchema, type CountryFormData } from '@/features/settings/countries/schemas'
import { type Country } from '../types'

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type CountriesActionDialogProps = {
  currentRow?: Country
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CountriesActionDialog({
                                        currentRow,
                                        open,
                                        onOpenChange,
                                      }: CountriesActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = !!currentRow
  const { mutate: createCountry, isPending: isCreating } = useCreateCountry()
  const { mutate: updateCountry, isPending: isUpdating } = useUpdateCountry()
  const isLoading = isCreating || isUpdating

  const form = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    defaultValues: isEdit && currentRow
      ? {
        iso2: currentRow.iso2,
        name: currentRow.name,
        status: currentRow.status === 1,
        phone_code: currentRow.phone_code ?? '',
        iso3: currentRow.iso3 ?? '',
        region: currentRow.region ?? '',
        subregion: currentRow.subregion ?? '',
        native: currentRow.native ?? '',
        latitude: currentRow.latitude ?? '',
        longitude: currentRow.longitude ?? '',
        emoji: currentRow.emoji ?? '',
        emojiU: currentRow.emojiU ?? '',
      }
      : {
        iso2: '',
        name: '',
        status: true,
        phone_code: '',
        iso3: '',
        region: '',
        subregion: '',
        native: '',
        latitude: '',
        longitude: '',
        emoji: '',
        emojiU: '',
      },
  })

  const onSubmit = (values: CountryFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }

    if (isEdit && currentRow) {
      updateCountry({ id: currentRow.id, data: values }, options)
    } else {
      createCountry(values, options)
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
            <DialogTitle>{isEdit ? 'Edit Country' : 'Add New Country'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the country details here. ' : 'Create a new country here. '}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
            <CountryForm form={form} onSubmit={onSubmit} id='country-form' />
          </div>

          <DialogFooter>
            <Button type='submit' form='country-form' disabled={isLoading}>
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
          <DrawerTitle>{isEdit ? 'Edit Country' : 'Add New Country'}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? 'Update the country details here. ' : 'Create a new country here. '}
            Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>

        <div className='no-scrollbar overflow-y-auto px-4'>
          <CountryForm form={form} onSubmit={onSubmit} id='country-form' />
        </div>

        <DrawerFooter>
          <Button type='submit' form='country-form' disabled={isLoading}>
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

interface CountryFormProps {
  form: UseFormReturn<CountryFormData>
  onSubmit: (data: CountryFormData) => void
  id: string
  className?: string
}

function CountryForm({ form, onSubmit, id, className }: CountryFormProps) {
  // Helper to accurately generate Unicode strings dynamically from a raw emoji
  const getUnicodeFromEmoji = (emoji: string) => {
    return Array.from(emoji)
      .map((char) => `U+${char.codePointAt(0)?.toString(16).toUpperCase()}`)
      .join(' ')
  }

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
                <FieldLabel htmlFor='country-name'>Name <span className='text-destructive'>*</span></FieldLabel>
                <Input id='country-name' placeholder='Country name' autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='iso2'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-iso2'>ISO2 <span className='text-destructive'>*</span></FieldLabel>
                <Input id='country-iso2' placeholder='US' maxLength={2} className="uppercase" autoComplete='off' {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='iso3'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-iso3'>ISO3</FieldLabel>
                <Input id='country-iso3' placeholder='USA' maxLength={3} className="uppercase" autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='phone_code'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-phone-code'>Phone Code</FieldLabel>
                <Input id='country-phone-code' placeholder='1' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='region'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-region'>Region</FieldLabel>
                <Input id='country-region' placeholder='Americas' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='subregion'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-subregion'>Subregion</FieldLabel>
                <Input id='country-subregion' placeholder='Northern America' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='native'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor='country-native'>Native Name</FieldLabel>
              <Input id='country-native' placeholder='United States' autoComplete='off' {...field} value={field.value ?? ''} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='latitude'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-latitude'>Latitude</FieldLabel>
                <Input id='country-latitude' placeholder='38.00000000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='longitude'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-longitude'>Longitude</FieldLabel>
                <Input id='country-longitude' placeholder='-97.00000000' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name='emoji'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="flex flex-col gap-2">
                <FieldLabel htmlFor='country-emoji'>Emoji</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="country-emoji"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span className="text-xl">{field.value}</span>
                      ) : (
                        <span>Pick an emoji</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-3 shadow-xl rounded-xl" align="start">
                    <EmojiPicker
                      className="font-['Lato'] w-[380px] border-none"
                      emojisPerRow={9}
                      emojiSize={36}
                      onEmojiSelect={(emojiObj: any) => {
                        const emojiString = typeof emojiObj === 'string' ? emojiObj : (emojiObj.native || emojiObj.emoji);
                        field.onChange(emojiString);
                        if (emojiString) {
                          const unicode = getUnicodeFromEmoji(emojiString);
                          form.setValue('emojiU', unicode, { shouldValidate: true });
                        }
                      }}
                    >
                      <EmojiPicker.Header>
                        <EmojiPicker.Input
                          placeholder="Search all emoji"
                          className="h-[36px] bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 w-full rounded-[8px] text-[15px] focus:shadow-[0_0_0_1px_#1d9bd1,0_0_0_6px_rgba(29,155,209,0.3)] dark:focus:shadow-[0_0_0_1px_#1d9bd1,0_0_0_6px_rgba(29,155,209,0.3)] focus:border-transparent focus:outline-none mb-1 px-3"
                          hideIcon
                        />
                      </EmojiPicker.Header>
                      <EmojiPicker.Group>
                        <EmojiPicker.List containerHeight={320} />
                      </EmojiPicker.Group>

                      <EmojiPicker.Preview>
                        {({ previewedEmoji }: any) => (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                            {previewedEmoji ?
                              <EmojiPicker.Content />
                              :
                              <button type="button" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Add Emoji</button>
                            }
                            <EmojiPicker.SkinTone />
                          </div>
                        )}
                      </EmojiPicker.Preview>
                    </EmojiPicker>
                  </PopoverContent>
                </Popover>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name='emojiU'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor='country-emojiU'>Emoji Unicode</FieldLabel>
                <Input id='country-emojiU' placeholder='U+1F1FA U+1F1F8' autoComplete='off' {...field} value={field.value ?? ''} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name='status'
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error} className='flex flex-row items-center justify-between rounded-md border p-4'>
              <div className='space-y-0.5'>
                <FieldLabel htmlFor='country-active'>Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the country from the system.
                </FieldDescription>
              </div>
              <Switch id='country-active' checked={!!field.value} onCheckedChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}