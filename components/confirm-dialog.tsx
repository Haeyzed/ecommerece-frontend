import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  disabled?: boolean
  desc: React.JSX.Element | string
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  handleConfirm: () => void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleConfirm,
    ...actions
  } = props

  if (isDesktop) {
    return (
      <AlertDialog {...actions}>
        <AlertDialogContent className={cn('w-full sm:max-w-lg', className)}>
          <AlertDialogHeader className='text-start'>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className='w-full'>{desc}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {children && <div className='w-full'>{children}</div>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {cancelBtnText ?? 'Cancel'}
            </AlertDialogCancel>
            <Button
              variant={destructive ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Loading...
                </>
              ) : (
                <>{confirmText ?? 'Continue'}</>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Drawer {...actions}>
      <DrawerContent className={cn('w-full', className)}>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription asChild>
            <div className='w-full'>{desc}</div>
          </DrawerDescription>
        </DrawerHeader>

        {children && <div className="px-4 w-full">{children}</div>}

        <DrawerFooter className='pt-2'>
          <Button
            className='w-full'
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
                Loading...
              </>
            ) : (
              <>{confirmText ?? 'Continue'}</>
            )}
          </Button>
          <DrawerClose asChild>
            <Button className='w-full' variant='outline' disabled={isLoading}>
              {cancelBtnText ?? 'Cancel'}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}