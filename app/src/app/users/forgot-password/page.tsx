// app/auth/forgot-password/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Mail } from 'lucide-react'

export default function ForgotPasswordWithOtp() {
  const supabase = createClient()
  const router = useRouter()

  const [step, setStep] = useState<'request' | 'verify' | 'update' | 'success'>('request')
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')          // 6-digit OTP from email
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setVerifyOpen(step === 'verify')
  }, [step])

  async function sendOtp() {
    if (!email) return toast.warning('Enter your email')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Code sent! Check your email.')
    setStep('verify')
  }

  async function verifyOtp() {
    if (code.length < 6) return toast.warning('Enter the 6-digit code')
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'recovery', // OTP for account recovery
    })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Code verified')
    setStep('update')
  }

  async function updatePassword() {
    if (password.length < 8) return toast.warning('Password must be at least 8 characters')
    if (password !== confirm) return toast.warning("Passwords don't match")

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Password updated! Please sign in.')
    setStep('success')
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className=" w-full h-full space-y-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} className="mx-auto mt-4" />
        <div className="h-full w-[600px] mt-[200px] mx-auto flex flex-col">

          {step === 'request' && (
            <>
              <h1 className="text-[48px] text-[#1D2939] font-bold">
                Forgot password?
              </h1>
              <p className="text-[14px]">No worries, we'll send you reset instructions.</p>
              <div className="flex flex-col my-12">
                <label htmlFor="email" className="text-[#475467] text-left text-[14px] font-medium font-helvetica">
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
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7]  disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Submit'}
              </button>
            </>
          )}

          {step === 'verify' && (
            <Dialog open={verifyOpen} onOpenChange={(open) => {
              setVerifyOpen(open)
              if (!open) setStep('request') // close -> go back
            }}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex justify-center items-center">
                      <div className="w-[56px] h-[56px] bg-[#F2F4F7] rounded-full flex justify-center items-center">
                        <Mail />
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center flex flex-col justify-center items-center space-y-4">
                  
                  <p className="font-medium text-[18px]">Please check your email</p>
                  <p>We've sent a code to {email}</p>

                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <p>
                    Didn't get the code? &nbsp;
                    <a href="#" onClick={sendOtp} className="underline text-[#6A52FF]">Click to resend</a>
                  </p>
                </div>

                <DialogFooter className="flex gap-2">
                  <DialogClose asChild>
                    <button
                      onClick={() => setStep('request')}
                      className="w-full cursor-pointer border text-[#1D2939] py-3 px-6 rounded-full hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    onClick={verifyOtp}
                    disabled={loading || code.length < 6}
                    className="w-full cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                  >
                    {loading ? 'Verifying…' : 'Verify code'}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {step === 'update' && (
            <>
              <h1 className="text-[48px] text-[#1D2939] font-bold">
                Create new password
              </h1>
              <p className="text-[14px]">Choose a strong password with at least 8 characters,</p>
              <p className="text-[14px]">including letters, numbers, and symbols.</p>
              <div className="relative flex items-start flex-col mt-8">
                  <label htmlFor="password" className="text-[#475467] text-[14px] font-medium font-helvetica">
                    Create new password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 top-8 right-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>
              <div className="relative flex items-start flex-col mt-4 mb-8">
                  <label htmlFor="password" className="text-[#475467] text-[14px] font-medium font-helvetica">
                    Confirm password
                  </label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="font-helvetica mt-2 w-full border bg-white border-[#F2F4F7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f43f1]"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 top-8 right-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>
              <button
                onClick={updatePassword}
                disabled={loading}
                className="w-full cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Submit'}
              </button>
            </>
          )}

          {step === 'success' && (
            <>
              <h1 className="text-[48px] text-[#1D2939] font-bold">
                Successful password reset!
              </h1>
              <p className="text-[14px]">You can now use your new password to login to your</p>
              <p className="text-[14px]">account.</p>
              <button
                onClick={() => router.replace("/users/login")}
                className="mt-8 w-full cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
              >
                Login
              </button>
            </>
          )}

          <p className="text-sm text-gray-600 mt-4">
            New to Must Celebrate?{' '}
            <Link href="/users/choose-role" className="text-[#6A52FF] font-medium hover:underline">
              Signup
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
