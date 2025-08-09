'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: data.user.id }),
      })
      const profile = await response.json()
      // if (profile.profileData.role === 'admin') router.push('/')
      // else router.push('/dashboard')
      router.push('/dashboard')
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white p-4">
      <div 
        className="
          relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl flex flex-col
          bg-[url(/images/login-bg.jpg)] bg-cover bg-center bg-no-repeat
          p-12
        "
      >
        {/* Black overlay with 40% opacity (≈ #00000066) */}
        <div className="absolute inset-0 bg-black/40  rounded-[32px]" />

        {/* Left Overlay Text (z-20 to appear above image and overlay) */}

        <Link href="/" className="relative z-20">
            <Image src="/images/logo-login.svg" alt="Logo" width={193} height={39} />
        </Link>
        <div className="relative w-full z-20 flex justify-between items-center h-full">

          <div className="text-white flex flex-col justify-center">
            <h1 className="text-[78px] font-bold leading-[120%] tracking-[0.22px]">
              Your Dream <br /> Event Starts <br /> Here
            </h1>
            <p className="mt-4 text-[16px] font-medium text-base leading-[120%] tracking-[0.22px]">Celebrate milestones. Plan with ease. Trusted by Filipinos.</p>
          </div>
          <div className="w-[631px] flex items-center justify-center">
            <div className="w-full h-full bg-white/70 backdrop-blur-[16px]  rounded-[32px] p-4 shadow-md">
              <h2 className="text-[48px] font-medium leading-[100%] tracking-[0px] text-center text-[#1D2939] mb-4 font-helvetica">Login</h2>
              <p className="text-[14px] font-normal leading-[150%] tracking-[0px] text-center text-[#667085] font-helvetica mb-4">
                Welcome back! Please sign in to continue.
              </p>

              <div className="flex gap-3 mb-4 items-center justify-center py-6">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 w-[261.5px] h-[48px] px-5 border border-[#F2F4F7] bg-white shadow-[0px_1px_2px_0px_#1018280D] rounded-full text-[#344054] text-base font-medium leading-[120%] tracking-[0.22px] hover:bg-gray-50 transition"
                >
                  <Image
                    src="/images/google-icon-logo.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('facebook')}
                  className="flex items-center justify-center gap-2 w-[261.5px] h-[48px] px-5 border border-[#F2F4F7] bg-white shadow-[0px_1px_2px_0px_#1018280D] rounded-full text-[#344054] text-base font-medium leading-[120%] tracking-[0.22px] hover:bg-gray-50 transition"
                >
                  <Image src="/images/facebook-logo.png" alt="Facebook" width={20} height={20} className="mr-2" />
                  Continue with Facebook
                </button>
              </div>

              <div className="flex items-center px-9 my-4">
                <hr className="flex-1 border-[#EAECF0]" />
                <span className="text-[14px] font-normal leading-[150%] tracking-[0px] text-center text-[#667085] font-helvetica">or continue with</span>
                <hr className="flex-1 border-[#EAECF0]" />
              </div>

              <form onSubmit={handleSubmit} className="px-6 space-y-4 mt-4">
                {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
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

                <div className="text-left text-sm">
                  <span className="font-helvetica text-[#475467] text-[14px] leading-[20px] font-medium">Forgot password? </span>
                  <Link href="/users/forgot-password" className="font-helvetica text-[14px] leading-[20px] font-medium text-[#6A52FF] hover:underline">
                    Reset
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="font-helvetica w-full bg-[#6A52FF] text-white py-4 mt-3 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                >
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </form>

              <div className="text-center text-sm my-3">
                <span className="font-helvetica text-[#344054] text-[14px] leading-[150%] font-medium">New to Must Celebrate? </span>
                <Link href="/users/choose-role" className="text-[14px] leading-[150%] font-bold font-helvetica text-[#6A52FF] hover:underline">
                  Sign Up
                </Link>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
