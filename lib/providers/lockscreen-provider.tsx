'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useIdle } from '@/hooks/use-idle'

type LockScreenContextType = {
  isLocked: boolean
  setLocked: (locked: boolean) => void
}

const LockScreenContext = createContext<LockScreenContextType | null>(null)

type LockScreenProviderProps = {
  children: React.ReactNode
}

export function LockScreenProvider({ children }: LockScreenProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { status } = useSession()
  
  // 30 minutes idle timer: useIdle(30 * 60 * 1000)
  // Currently set to 1 minute for testing as per your code
  const idle = useIdle(1 * 60 * 1000) 
  
  const [isLocked, setIsLockedState] = useState(false)

  // Helper to sync state with LocalStorage
  const setLocked = useCallback((locked: boolean) => {
    setIsLockedState(locked)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLocked', locked ? 'true' : 'false')
    }
  }, [])

  // Helper function to lock the screen and preserve current URL
  const lockScreen = useCallback(() => {
    if (pathname === '/lock-screen') return // Already on lock screen

    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const params = new URLSearchParams()
    params.set('returnUrl', currentUrl)
    
    setLocked(true)
    router.replace(`/lock-screen?${params.toString()}`)
  }, [pathname, searchParams, router, setLocked])

  // Initialize state from LocalStorage on mount
  useEffect(() => {
    const storedLock = localStorage.getItem('isLocked') === 'true'
    if (storedLock) {
      setIsLockedState(true)
    }
  }, [])

  // Handle Idle State - ONLY if authenticated
  useEffect(() => {
    if (status === 'authenticated' && idle && !isLocked) {
      lockScreen()
      toast.warning('Locked due to inactivity!', { position: 'top-center' })
    }
  }, [status, idle, isLocked, lockScreen])

  // Handle Keyboard Shortcut (Cmd+L or Ctrl+L + Shift) - ONLY if authenticated
  useEffect(() => {
    if (status !== 'authenticated') return

    const down = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        lockScreen()
        toast.success('Screen locked manually')
      }
    }
    window.addEventListener('keydown', down, true)
    return () => window.removeEventListener('keydown', down, true)
  }, [status, lockScreen])

  // Security Guard: Redirect if locked and trying to access other pages
  // Also ensures we don't redirect away if we are not locked
  useEffect(() => {
    if (isLocked && pathname !== '/lock-screen') {
       // Re-construct the return URL just in case, though usually handled by lockScreen()
       const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
       const params = new URLSearchParams()
       params.set('returnUrl', currentUrl)
       router.replace(`/lock-screen?${params.toString()}`)
    }
  }, [isLocked, pathname, searchParams, router])

  return (
    <LockScreenContext.Provider value={{ isLocked, setLocked }}>
      {children}
    </LockScreenContext.Provider>
  )
}

export function useLockScreen() {
  const context = useContext(LockScreenContext)
  if (!context) {
    throw new Error('useLockScreen must be used within a LockScreenProvider')
  }
  return context
}