'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { type Employee } from '../types'
import { useActiveIdCardTemplate } from '@/features/settings/id-card-templates/api'
import { generateIdCardsPdf } from '../utils/generate-id-card'
import { HugeiconsIcon } from '@hugeicons/react'
import { Download01Icon } from '@hugeicons/core-free-icons'

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
}

export function EmployeesIdCardDialog({ open, onOpenChange, employees }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: activeTemplate, isLoading: isConfigLoading } = useActiveIdCardTemplate()

  useEffect(() => {
    // Because of the API generic fix, activeTemplate maps cleanly
    const designConfig = activeTemplate?.design_config;

    if (open && employees.length > 0 && designConfig) {
      let isMounted = true;

      const generatePdf = async () => {
        // Await microtask to prevent ESLint set state in effect warning
        await Promise.resolve();

        if (!isMounted) return;
        setIsGenerating(true);

        try {
          const generated = await generateIdCardsPdf(employees, designConfig);
          // Strictly force to string so TypeScript knows it's not a URL object
          const finalUrlString: string = String(generated);

          if (isMounted) {
            setPdfUrl((prevUrl) => {
              if (prevUrl) window.URL.revokeObjectURL(prevUrl);
              return finalUrlString;
            });
          } else {
            window.URL.revokeObjectURL(finalUrlString);
          }
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        } finally {
          if (isMounted) {
            setIsGenerating(false);
          }
        }
      };

      generatePdf();

      return () => {
        isMounted = false;
      };
    }
  }, [open, employees, activeTemplate]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `ID_Cards_${new Date().getTime()}.pdf`
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row justify-between items-center pr-6">
          <div>
            <DialogTitle>ID Card Preview</DialogTitle>
            <DialogDescription>
              Previewing {employees.length} ID card{employees.length > 1 ? 's' : ''}.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex justify-center bg-muted rounded-md border h-[500px] overflow-hidden relative">
          {(isConfigLoading || isGenerating) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Spinner className="size-8" />
            </div>
          )}
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full border-0"
              title="ID Card Preview"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleDownload} disabled={!pdfUrl || isGenerating}>
            <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}