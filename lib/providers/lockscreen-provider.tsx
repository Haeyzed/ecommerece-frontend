'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useIdle } from '@/hooks/use-idle'

// 1. Define the Context Type
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
  
  // 30 minutes idle timer: useIdle(30 * 60 * 1000)
  const idle = useIdle(1 * 60 * 1000) // 1 minute (for testing) 
  
  const [isLocked, setIsLockedState] = useState(false)

  // 2. Helper to sync state with LocalStorage
  const setLocked = useCallback((locked: boolean) => {
    setIsLockedState(locked)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLocked', locked ? 'true' : 'false')
    }
  }, [])

  // 3. Initialize state from LocalStorage on mount
  useEffect(() => {
    const storedLock = localStorage.getItem('isLocked') === 'true'
    if (storedLock) {
      setIsLockedState(true)
    }
  }, [])

  // 4. Handle Idle State
  useEffect(() => {
    if (idle && !isLocked) {
      setLocked(true)
      toast.warning('Locked due to inactivity!', { position: 'top-center' })
    }
  }, [idle, isLocked, setLocked])

  // 5. Handle Keyboard Shortcut (Cmd+L or Ctrl+L + Shift)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        setLocked(true)
        toast.success('Screen locked manually')
      }
    }
    window.addEventListener('keydown', down, true)
    return () => window.removeEventListener('keydown', down, true)
  }, [setLocked])

  // 6. Security Guard: Redirect if locked and trying to access other pages
  useEffect(() => {
    if (isLocked && pathname !== '/lock-screen') {
      router.replace('/lock-screen')
    }
  }, [isLocked, pathname, router])

  return (
    <LockScreenContext.Provider value={{ isLocked, setLocked }}>
      {children}
    </LockScreenContext.Provider>
  )
}

// 7. Export a custom hook to use this context easily
export function useLockScreen() {
  const context = useContext(LockScreenContext)
  if (!context) {
    throw new Error('useLockScreen must be used within a LockScreenProvider')
  }
  return context
}