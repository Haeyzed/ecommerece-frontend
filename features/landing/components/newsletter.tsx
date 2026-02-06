'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className='w-full bg-muted/50 py-12 sm:py-16 lg:py-20'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl'>
          {/* Section Header */}
          <div className='mb-8 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-primary/10 p-3'>
                <Mail className='size-6 text-primary' />
              </div>
            </div>
            <h2 className='mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl'>
              Subscribe to Our Newsletter
            </h2>
            <p className='text-base text-muted-foreground sm:text-lg'>
              Get exclusive deals, new product launches, and helpful tips delivered
              to your inbox. We promise not to spam you!
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row'>
            <Input
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='flex-1'
            />
            <Button
              type='submit'
              size='lg'
              className='w-full sm:w-auto'
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </Button>
          </form>

          {/* Success message */}
          {subscribed && (
            <p className='mt-4 text-center text-sm text-green-600'>
              ✓ Thank you for subscribing! Check your email for special offers.
            </p>
          )}

          {/* Privacy note */}
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
