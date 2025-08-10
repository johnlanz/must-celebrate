'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { Suspense } from 'react'

function SignUpPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')?.toLowerCase() ?? null
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!role || !['customer', 'vendor'].includes(role)) {
      router.replace('/users/choose-role')
    }
  }, [role, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.warning('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      console.log(JSON.stringify({ firstName, lastName, email, phone, password, role }))
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password, role }),
      })
      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        toast.error(data.error || 'Error creating account')
        return
      }

      toast.success(data.message)
      router.push('/users/signup-success')
    } catch (err) {
      setLoading(false)
      console.error('Signup error:', err)
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`,
      },
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white p-4">
      <div className="relative w-full h-full rounded-[32px] shadow-2xl flex flex-col bg-[url(/images/login-bg.jpg)] bg-cover bg-center bg-no-repeat p-12">
        <div className="absolute inset-0 bg-black/40 rounded-[32px]" />
        <div className="relative z-20">
          <Image src="/images/logo-login.svg" alt="Logo" width={193} height={39} />
        </div>
        <div className="relative w-full z-20 flex justify-between items-center h-full">
          <div className="text-white flex flex-col justify-center">
            <h1 className="text-[78px] font-bold leading-[120%] tracking-[0.22px]">
              Your Dream <br /> Event Starts <br /> Here
            </h1>
            <p className="mt-4 text-[16px] font-medium leading-[120%] tracking-[0.22px]">
              Celebrate milestones. Plan with ease. Trusted by Filipinos.
            </p>
          </div>
          <div className="w-[631px] flex items-center justify-center">
            <div className="w-full h-full bg-white/70 backdrop-blur-[16px] rounded-[32px] p-4 shadow-md">
              <h2 className="text-[48px] font-medium leading-[100%] text-center text-[#1D2939] mb-4 font-helvetica mt-3">
                Sign Up
              </h2>
              <p className="text-[14px] font-normal leading-[150%] text-center text-[#667085] font-helvetica mb-4">
                Welcome! Create your account to continue.
              </p>

              <div className="flex gap-3 mb-4 items-center justify-center py-4">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 w-[261.5px] h-[48px] px-5 border border-[#F2F4F7] bg-white shadow rounded-full text-[#344054] text-base font-medium hover:bg-gray-50 transition"
                >
                  <Image src="/images/google-icon-logo.svg" alt="Google" width={20} height={20} />
                  Continue with Google
                </button>
                <button
                  onClick={() => handleOAuthLogin('facebook')}
                  className="flex items-center justify-center gap-2 w-[261.5px] h-[48px] px-5 border border-[#F2F4F7] bg-white shadow rounded-full text-[#344054] text-base font-medium hover:bg-gray-50 transition"
                >
                  <Image src="/images/facebook-logo.png" alt="Facebook" width={20} height={20} />
                  Continue with Facebook
                </button>
              </div>

              <div className="flex items-center px-9 my-4">
                <hr className="flex-1 border-[#EAECF0]" />
                <span className="text-[14px] font-normal leading-[150%] text-center text-[#667085] font-helvetica">
                  or continue with
                </span>
                <hr className="flex-1 border-[#EAECF0]" />
              </div>

              <form onSubmit={handleSubmit} className="px-6 space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#475467] text-[14px] font-medium font-helvetica">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name..."
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                  </div>
                  <div>
                    <label className="text-[#475467] text-[14px] font-medium font-helvetica">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name..."
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="text-[#475467] text-[14px] font-medium font-helvetica">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                  </div>
                  <div>
                    <label className="text-[#475467] text-[14px] font-medium font-helvetica">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="password" className="text-[#475467] text-[14px] font-medium font-helvetica">
                      Password
                    </label>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 top-8 right-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label htmlFor="confirm-password" className="text-[#475467] text-[14px] font-medium font-helvetica">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 top-8 right-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="font-helvetica w-full bg-[#6A52FF] text-white py-4 mt-3 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              <div className="text-center my-2 text-sm">
                <span className="font-helvetica text-[#344054] text-[14px] font-medium">
                  Already part of Must Celebrate?
                </span>
                <Link href="/users/login" className="text-[14px] font-bold font-helvetica text-[#6A52FF] hover:underline ml-1">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DefaultSignUpPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <SignUpPage />
    </Suspense>
  )
}