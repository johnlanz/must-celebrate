// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Optional: Call your /api/profile route to fetch role
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: session.user.id }),
        })
        const profile = await response.json()
        const role = profile.profileData?.role

        if (role === 'admin') router.push('/')
        else if (role === 'vendor') router.push('/vendor/dashboard')
        else if (role === 'planner') router.push('/planner/dashboard')
        else router.push('/order-notifications')
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [router, supabase])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Signing you in, please wait...</p>
    </div>
  )
}
