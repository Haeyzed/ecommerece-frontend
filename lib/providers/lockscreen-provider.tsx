'use client'

/**
 * LockScreenProvider
 *
 * Manages the application's lock screen state.
 *
 * Architecture Note:
 * The logic interacting with `useSearchParams` and `useRouter` is isolated
 * in `LockScreenLogic` and wrapped in `Suspense`. This prevents build errors
 * on static pages (like 404) that inherit the RootLayout but cannot
 * handle search params at build time.
 */

import { createContext, useContext, useEffect, useState, useCallback, Suspense } from 'react'
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

/**
 * Internal component to handle side effects (Idle, URL redirects, Shortcuts).
 * Must be wrapped in Suspense because it uses useSearchParams.
 */
function LockScreenLogic({ isLocked, setLocked }: { isLocked: boolean; setLocked: (v: boolean) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { status } = useSession()
  
  // 1 minute idle timer for testing
  const idle = useIdle(5 * 60 * 1000) 

  const lockScreen = useCallback(() => {
    if (pathname === '/lock-screen') return

    // Capture current location to return after unlock
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const params = new URLSearchParams()
    if (currentUrl !== '/dashboard' && currentUrl !== '/') {
        params.set('returnUrl', currentUrl)
    }
    
    setLocked(true)
    router.replace(`/lock-screen?${params.toString()}`)
  }, [pathname, searchParams, router, setLocked])

  // Handle Idle State - ONLY if authenticated
  useEffect(() => {
    if (status === 'authenticated' && idle && !isLocked) {
      lockScreen()
      toast.warning('Locked due to inactivity!')
    }
  }, [status, idle, isLocked, lockScreen])

  // Handle Keyboard Shortcut
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
  useEffect(() => {
    if (isLocked && pathname !== '/lock-screen') {
       const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
       const params = new URLSearchParams()
       params.set('returnUrl', currentUrl)
       router.replace(`/lock-screen?${params.toString()}`)
    }
  }, [isLocked, pathname, searchParams, router])

  return null
}

export function LockScreenProvider({ children }: LockScreenProviderProps) {
  const [isLocked, setIsLockedState] = useState(false)

  const setLocked = useCallback((locked: boolean) => {
    setIsLockedState(locked)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLocked', locked ? 'true' : 'false')
    }
  }, [])

  // Initialize from storage
  useEffect(() => {
    const storedLock = localStorage.getItem('isLocked') === 'true'
    if (storedLock) {
      setIsLockedState(true)
    }
  }, [])

  return (
    <LockScreenContext.Provider value={{ isLocked, setLocked }}>
      {/* Wrap logic in Suspense to prevent "useSearchParams() should be wrapped in a suspense boundary"
        error on static pages like /404 
      */}
      <Suspense fallback={null}>
        <LockScreenLogic isLocked={isLocked} setLocked={setLocked} />
      </Suspense>
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