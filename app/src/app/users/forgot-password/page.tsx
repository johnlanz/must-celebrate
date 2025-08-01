'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { forgotPassword } from '../actions'
import Link from 'next/link'
import LoadingButton from '@/components/layout/LoadingButton'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(event.currentTarget)
      await forgotPassword(formData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error sending reset link:', error)
      // Optionally set an error state here to show a message to the user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="max-w-md  w-full space-y-6">
        <div className="flex justify-center items-center"><img src="/images/logo.svg" alt="Logo" className="w-[300px] mb-4" /></div>

        <h2 className="text-2xl font-bold">Forgot your password?</h2>
        {submitted ? (
          <p className="text-green-600">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <p className="pb-4">Enter the email address of your Must Celebrate account. You will receive an email to reset your password.

              </p>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="you@example.com"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-[#67a626] focus:ring-[#67a626]"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Link
                href="/users/login"
                className="text-base text-[#1800AD] hover:underline"
              >
                ← Back
              </Link>

              <LoadingButton 
                type="submit" 
                loading={loading} 
                loadingText="Sending..." 
                className="bg-[#1800AD] text-white py-2 px-4 rounded-md hover:bg-[#1800AD]"
              >
                Send Reset Link
              </LoadingButton>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
