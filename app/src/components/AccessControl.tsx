// components/AccessControl.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { IsLogin, UserAuth, HasAccess } from '@/lib/UserAuth'
import { FullScreenLoader } from './layout/FullScreenLoader'

type AccessControlOptions = {
  access?: string | string[]
  noAccessRedirect?: string
  loginRedirect?: string
}

/**
 * HOC for pages (no props) or components: ensure hooks of WrappedComponent run separately.
 */
export function AccessControl(
  WrappedComponent: React.ComponentType,  // page takes no props
  options: AccessControlOptions = {}
) {
  const {
    access,
    loginRedirect = '/users/login',
    noAccessRedirect = '/no-access',
  } = options

  const WithAccessControl: React.FC = () => {
    const router = useRouter()
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
      let mounted = true
      async function verify() {
        const loggedIn = await IsLogin()
        if (!loggedIn) {
          console.log('User is not logged in, redirecting to login page.')
          toast.info('Please log in to continue.')
          router.replace(loginRedirect)
          return
        }
        const currentUser = await UserAuth()
        if (access) {
          const ok = HasAccess(access, currentUser)
          if (!ok) {
            toast.warn('You do not have permission to access this page.')
            router.replace(noAccessRedirect)
            return
          }
        }
        if (mounted) setIsVerified(true)
      }
      verify()
      return () => { mounted = false }
    }, [router])

    if (!isVerified) {
      return <FullScreenLoader />
    }
    return <WrappedComponent />    // render as React component
  }

  return WithAccessControl
}

export default AccessControl