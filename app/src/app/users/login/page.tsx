'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      if (profile.profileData.role === 'admin') router.push('/')
      else router.push('/order-notifications')
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="relative w-full  h-[120vh] rounded-[32px] overflow-hidden shadow-2xl flex">
        {/* Background image */}
        <Image
          src="/images/login-bg.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        {/* Black overlay with 40% opacity (≈ #00000066) */}
        <div className="absolute inset-0 bg-black/40  rounded-[32px]" />

        {/* Left Overlay Text (z-20 to appear above image and overlay) */}

        <div className="relative z-20 flex-1 text-white flex flex-col mx-[48px]">
          {/* Logo at top-left */}
          <div className="absolute top-12 left-12">
            <Image src="/images/logo-login.svg" alt="Logo" width={193} height={39} />
          </div>

          {/* Centered text */}
          <div className="flex-1 flex flex-col justify-center px-10">
            <h1 className="text-[78px] font-bold leading-[120%] tracking-[0.22px]">
              Your Dream <br /> Event Starts <br /> Here
            </h1>
            <p className="mt-4 text-[16px] font-medium text-base leading-[120%] tracking-[0.22px]">Celebrate milestones. Plan with ease. Trusted by Filipinos.</p>
          </div>
        </div>


        {/* Right Login Card */}
        <div className="relative flex-1 flex items-center justify-center p-6 mx-[48px]">
          <div className="w-full max-[631px] bg-white/70 backdrop-blur-[16px]  rounded-[32px] p-8 shadow-md">
            <h2 className="text-[48px] font-medium leading-[100%] tracking-[0px] text-center text-[#1D2939] mb-6 font-helvetica">Login</h2>
            <p className="text-[14px] font-normal leading-[150%] tracking-[0px] text-center text-[#667085] font-helvetica mb-6">
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

            <div className="flex items-center my-4">
              <hr className="flex-1 border-[#EAECF0]" />
              <span className="text-[14px] font-normal leading-[150%] tracking-[0px] text-center text-[#667085] font-helvetica">or continue with</span>
              <hr className="flex-1 border-[#EAECF0]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-10">
              {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
              <label className="text-[#475467] text-[14px] leading-[20px] font-medium font-helvetica ">Email</label>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-helvetica w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
              />
              <label className="text-[#475467] text-[14px] leading-[20px] font-medium font-helvetica ">Password</label>

              <input
                type="password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-helvetica w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
              />

              <div className="text-left text-sm">
                <span className="font-helvetica text-[#475467] text-[14px] leading-[20px] font-medium">Forgot password? </span>
                <Link href="/users/forgot-password" className="font-helvetica text-[14px] leading-[20px] font-medium text-[#1800AD] hover:underline">
                  Reset
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="font-helvetica w-full bg-[#1800AD] text-white py-2 mt-10 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-6 text-sm">
              <span className="font-helvetica text-[#344054] text-[14px] leading-[150%] font-medium">New to Must Celebrate? </span>
              <Link href="/users/signup" className="text-[14px] leading-[150%] font-bold font-helvetica text-[#1800AD] hover:underline">
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
