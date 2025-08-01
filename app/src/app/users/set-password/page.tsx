'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // Give Supabase a moment to sync/establish the session cookie
    await new Promise((res) => setTimeout(res, 1000))

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('Session data:', sessionData)

    // If there's no active session, let the user know
    if (!sessionData?.session || sessionError) {
      alert('Session missing. Please try logging in again.')
      setLoading(false)
      return
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      alert('Error setting password: ' + updateError.message)
      setLoading(false)
      return
    }

    // Now that password is updated, immediately sign out
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('Error signing out after password change:', signOutError)
      // Even if sign-out fails, we still redirect them to login
    }

    setLoading(false)
    router.push('/users/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Create your password</h1>
      <p className="text-gray-600 mb-6">
        You've successfully signed in. Now create a secure password for future logins.
      </p>

      <form onSubmit={handleSetPassword} className="w-full max-w-sm space-y-4">
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading ? 'Saving...' : 'Set Password'}
        </button>
      </form>
    </div>
  )
}