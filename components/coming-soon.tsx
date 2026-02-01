import { HugeiconsIcon } from '@hugeicons/react'
import { TelescopeIcon } from '@hugeicons/core-free-icons'

export function ComingSoon() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <HugeiconsIcon icon={TelescopeIcon} size={72} strokeWidth={2} />
        <h1 className='text-4xl leading-tight font-bold'>Coming Soon!</h1>
        <p className='text-center text-muted-foreground'>
          This page has not been created yet. <br />
          Stay tuned though!
        </p>
      </div>
    </div>
  )
}