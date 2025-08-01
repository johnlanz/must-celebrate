// app/users/check-email/CheckEmailClient.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import LoadingButton from '@/components/layout/LoadingButton'

export default function CheckEmailClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''

  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasteData) return
    const digits = pasteData.split('')
    const newCode = [...code]
    for (let offset = 0; offset < digits.length && index + offset < 6; offset++) {
      newCode[index + offset] = digits[offset]
    }
    setCode(newCode)
    const lastFilledIndex = Math.min(index + digits.length - 1, 5)
    const nextInput = document.getElementById(`code-${lastFilledIndex}`) as HTMLInputElement
    nextInput?.focus()
  }

  const handleVerify = async () => {
    const token = code.join('')
    if (token.length !== 6) {
      return alert('Please enter a valid 6-digit code.')
    }
    setVerifyLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })
      if (error) {
        alert('Verification failed: ' + error.message)
        return
      }
      await new Promise((res) => setTimeout(res, 1000))
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        alert('Session not available. Try refreshing the page.')
        return
      }
      router.push('/users/set-password')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setResendMessage('No email found in URL.')
      return
    }
    setResendLoading(true)
    setResendMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/users/reset-password`,
      })
      if (error) throw error
      setResendMessage('A new code has been sent to your email.')
    } catch (err: any) {
      console.error('Resend failed:', err)
      setResendMessage('Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/images/sham_logo2.png"
        alt="Logo"
        className="w-[300px] mb-8"
      />
      <h1 className="text-2xl font-bold mb-2">Check your email</h1>
      <p className="text-gray-700 mb-6">
        We've sent a 6-digit confirmation code to <strong>{email}</strong>. It will expire shortly, so enter it soon.
      </p>
      <div className="flex space-x-2 mb-2">
        {code.map((digit, i) => (
          <input
            key={i}
            id={`code-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onPaste={(e) => handlePaste(e, i)}
            className="w-10 h-12 text-2xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>
      <LoadingButton
        onClick={handleVerify}
        loading={verifyLoading}
        loadingText="Verifying..."
        className="px-6 py-2 mb-4 rounded bg-[#67a626] text-white font-semibold hover:bg-[#684CC4] transition"
      >
        Verify
      </LoadingButton>
      <p className="text-sm text-gray-600">
        Didn't get the code?{' '}
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className={`inline underline cursor-pointer text-[#67a626] ${
            resendLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Request another one
        </button>
      </p>
      {resendMessage && (
        <p className="mt-2 text-sm text-green-600">{resendMessage}</p>
      )}
      <p className="text-sm text-gray-600 mt-6">
        Still need help? Visit our{' '}
        <a href="#" className="text-[#67a626] underline">
          help center
        </a>.
      </p>
    </div>
  )
}
