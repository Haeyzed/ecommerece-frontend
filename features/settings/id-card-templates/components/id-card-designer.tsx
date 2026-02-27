'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { PaintBoardIcon, FloppyDiskIcon, Image01Icon, Delete02Icon } from '@hugeicons/core-free-icons'

import { useActiveIdCardTemplate, useUpdateIdCardTemplate } from '../api'
import { generateIdCardsPdf } from '@/features/hrm/employees/utils/generate-id-card'
import { type Employee } from '@/features/hrm/employees/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const idCardDesignSchema = z.object({
  primary_color: z.string().min(4),
  text_color: z.string().min(4),
  logo_url: z.string().nullable().optional(),
  show_phone: z.boolean(),
  show_address: z.boolean(),
  show_qr_code: z.boolean(),
})

type DesignFormData = z.infer<typeof idCardDesignSchema>

// Strict mapping to Employee Interface (No undefined, proper nulls)
const DUMMY_EMPLOYEE: Employee = {
  id: 0,
  staff_id: 'EMP-00123',
  name: 'John Doe',
  email: 'john@example.com',
  phone_number: '+234 800 123 4567',
  basic_salary: 5000,
  address: '123 Victoria Island, Lagos',
  department_id: 1,
  designation_id: 1,
  shift_id: null,
  country_id: null,
  state_id: null,
  city_id: null,
  user_id: null,
  sale_commission_percent: null,
  department: { id: 1, name: 'Engineering' },
  designation: { id: 1, name: 'Lead Developer' },
  shift: null,
  country: null,
  state: null,
  city: null,
  image_url: null,
  is_active: true,
  active_status: 'active',
  is_sale_agent: false,
  sales_agent: 'no',
  sales_target: [],
  user: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export function IdCardDesigner() {
  const { data: activeTemplate, isLoading: isLoadingConfig } = useActiveIdCardTemplate()
  const { mutate: updateTemplate, isPending: isSaving } = useUpdateIdCardTemplate()

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<DesignFormData>({
    resolver: zodResolver(idCardDesignSchema),
    defaultValues: {
      primary_color: '#171f27',
      text_color: '#ffffff',
      logo_url: null,
      show_phone: true,
      show_address: true,
      show_qr_code: true,
    }
  })

  // activeTemplate is now strongly typed as IdCardTemplate because of the api.ts fix
  useEffect(() => {
    if (activeTemplate?.design_config) {
      form.reset(activeTemplate.design_config)
    }
  }, [activeTemplate, form])

  const watchedValues = form.watch()

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(async () => {
      await Promise.resolve(); // Microtask prevents ESLint cascading renders warning
      if (!isMounted) return;

      setIsGenerating(true)
      try {
        const generated = await generateIdCardsPdf([DUMMY_EMPLOYEE], watchedValues as any)

        // Ensure TS understands this is definitely a string
        const finalUrlString: string = String(generated);

        if (isMounted) {
          setPdfUrl(prev => {
            if (prev) window.URL.revokeObjectURL(prev)
            return finalUrlString;
          })
        } else {
          window.URL.revokeObjectURL(finalUrlString);
        }
      } catch (error) {
        console.error("Failed to generate PDF:", error)
      } finally {
        if (isMounted) setIsGenerating(false)
      }
    }, 500)

    return () => {
      isMounted = false;
      clearTimeout(timer)
    }
  }, [watchedValues])

  const onSubmit = (data: DesignFormData) => {
    if (!activeTemplate) return;

    updateTemplate({
      id: activeTemplate.id,
      data: { design_config: data }
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue('logo_url', reader.result as string, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoadingConfig) {
    return <div className="flex h-64 items-center justify-center"><Spinner /></div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Form - Left Side */}
      <div className="lg:col-span-7 xl:col-span-8">
        <form id="id-card-design-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <HugeiconsIcon icon={PaintBoardIcon} className="size-5" />
                    ID Card Designer
                  </CardTitle>
                  <CardDescription>
                    Customize the layout, colors, and fields displayed on employee ID cards.
                  </CardDescription>
                </div>
                <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                  {isSaving ? <Spinner className="mr-2 size-4" /> : <HugeiconsIcon icon={FloppyDiskIcon} className="mr-2 size-4" />}
                  Save Design
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6 pt-6">

              {/* Colors */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Brand Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Controller control={form.control} name="primary_color" render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Primary Background</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-14 h-10 p-1 cursor-pointer" {...field} />
                        <Input type="text" className="uppercase font-mono" {...field} />
                      </div>
                    </div>
                  )} />

                  <Controller control={form.control} name="text_color" render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-14 h-10 p-1 cursor-pointer" {...field} />
                        <Input type="text" className="uppercase font-mono" {...field} />
                      </div>
                    </div>
                  )} />
                </div>
              </div>

              <Separator />

              {/* Logo */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Company Logo</h3>
                <Controller control={form.control} name="logo_url" render={({ field }) => (
                  <div className="space-y-4">
                    {field.value ? (
                      <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20">
                        <img src={field.value} alt="Logo" className="h-12 object-contain" />
                        <Button type="button" variant="destructive" size="sm" onClick={() => form.setValue('logo_url', null, { shouldDirty: true })}>
                          <HugeiconsIcon icon={Delete02Icon} className="mr-2 size-4" /> Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                          <HugeiconsIcon icon={Image01Icon} className="size-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">Click to upload logo (PNG/JPG)</span>
                        </Label>
                        <Input id="logo-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoUpload} />
                      </div>
                    )}
                  </div>
                )} />
              </div>

              <Separator />

              {/* Toggles */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Visible Fields</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller control={form.control} name="show_phone" render={({ field }) => (
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <Label className="cursor-pointer" htmlFor="show-phone">Show Phone Number</Label>
                      <Switch id="show-phone" checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )} />

                  <Controller control={form.control} name="show_address" render={({ field }) => (
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <Label className="cursor-pointer" htmlFor="show-address">Show Address</Label>
                      <Switch id="show-address" checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )} />

                  <Controller control={form.control} name="show_qr_code" render={({ field }) => (
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <Label className="cursor-pointer" htmlFor="show-qr">Show QR Code</Label>
                      <Switch id="show-qr" checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )} />
                </div>
              </div>

            </CardContent>
          </Card>
        </form>
      </div>

      {/* Live Preview - Right Side */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="sticky top-24">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-base flex items-center justify-between">
                Live Preview
                {isGenerating && <Spinner className="size-4" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} // Hides PDF viewer toolbars
                  className="w-full h-full border-0"
                  title="ID Card Live Preview"
                />
              ) : (
                <Spinner />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}