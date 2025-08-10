// components/AccessControl.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { IsLogin, UserAuth, HasAccess } from '@/lib/UserAuth'
import { FullScreenLoader } from './layout/FullScreenLoader'

type AccessControlOptions = {
  access?: string | string[]
  noAccessRedirect?: string
  loginRedirect?: string
}

export function AccessControl<P extends object>(
  WrappedComponent: React.ComponentType<P & { currentUser: any }>,
  options: AccessControlOptions = {}
) {
  const {
    access,
    loginRedirect = '/users/login',
    noAccessRedirect = '/no-access',
  } = options

  const WithAccessControl: React.FC<P> = (props) => {
    const router = useRouter()
    const [isVerified, setIsVerified] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
      let mounted = true
      async function verify() {
        const loggedIn = await IsLogin()
        if (!loggedIn) {
          toast.info('Please log in to continue.')
          router.replace(loginRedirect)
          return
        }
        const user = await UserAuth()
        if (access) {
          const ok = HasAccess(access, user)
          if (!ok) {
            toast.warn('You do not have permission to access this page.')
            router.replace(noAccessRedirect)
            return
          }
        }
        if (mounted) {
          setCurrentUser(user)
          setIsVerified(true)
        }
      }
      verify()
      return () => { mounted = false }
    }, [router])

    if (!isVerified) return <FullScreenLoader />

    return <WrappedComponent {...props} currentUser={currentUser} />
  }

  return WithAccessControl
}

export default AccessControl
