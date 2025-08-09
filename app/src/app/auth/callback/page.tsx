// app/auth/callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { deriveFirstLast } from '@/utils/names'
import Image from 'next/image'
import { toast } from 'sonner'

type Role = 'customer' | 'vendor'

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const roleParam = (() => {
    const r = searchParams.get('role')?.toLowerCase()
    return r === 'customer' || r === 'vendor' ? (r as Role) : undefined
  })()

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(true)

  const redirectByRole = (role: Role) => {
    //router.replace(role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard')
    router.replace(`/dashboard`)
  }

  const saveRole = async (chosenRole: Role) => {
    setSaving(true)
    try {
      const {
        data: { session },
        error: sessErr,
      } = await supabase.auth.getSession()
      if (sessErr || !session) {
        router.replace('/users/login')
        return
      }

      const user = session.user
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('id, display_name, first_name, last_name, avatar_url, role')
        .eq('id', user.id)
        .maybeSingle()

      if (fetchErr) {
        console.error('fetch profile error:', fetchErr)
      }

      if (existing?.role) {
        toast.success('Welcome back!')
        redirectByRole(existing.role as Role)
        return
      }

      const meta = user.user_metadata || {}
      const { first_name, last_name } = deriveFirstLast(meta, user.email)

      const displayName =
        existing?.display_name ||
        meta.full_name ||
        meta.name ||
        (first_name && last_name ? `${first_name} ${last_name}` : user.email?.split('@')[0]) ||
        'New User'

      const avatar =
        existing?.avatar_url ||
        meta.picture ||
        meta.avatar_url ||
        null

      const payload = existing
        ? {
            id: user.id,
            role: chosenRole,
            display_name: displayName,
            first_name: existing?.first_name ?? first_name,
            last_name: existing?.last_name ?? last_name,
            avatar_url: avatar,
            provider: user.app_metadata?.provider || 'google',
          }
        : {
            id: user.id,
            display_name: displayName,
            first_name,
            last_name,
            avatar_url: avatar,
            provider: user.app_metadata?.provider || 'google',
            role: chosenRole,
          }

      const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })

      if (upsertErr) {
        console.error('upsert profile error:', upsertErr)
        toast.error('Failed to save your role')
        return
      }

      toast.success('Role saved!')
      //router.replace(chosenRole === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard')
      router.replace('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  // Support `?role=customer|vendor` deep link (auto-save then redirect)
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/users/login')
        return
      }

      // No role param: check existing role and redirect if present
      const { data: existing } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      console.log(existing)

      if (existing?.role) {
        router.replace(`/dashboard`)
        return
      }

      // If deep link role exists, let saveRole handle the logic (it won't overwrite an existing role)
      if (roleParam) {
        await saveRole(roleParam)
        return
      }

      setChecking(false)
    })()
  }, [roleParam]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderCheck = (role: Role) => (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200
        ${selectedRole === role ? 'border-[#6A52FF] bg-[#E5E0FF]' : 'border-gray-300 bg-white'}`}
    >
      {selectedRole === role && <span className="w-2.5 h-2.5 rounded-full bg-[#6A52FF]" />}
    </span>
  )

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role')
      return
    }
    await saveRole(selectedRole)
  }

  // If roleParam is present, we’re already saving—show spinner
  if (roleParam || checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <svg
            className="animate-spin h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full h-full space-y-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} className="mx-auto mt-4" />
        <h1 className="text-[32px] sm:text-[48px] text-[#1D2939] font-bold leading-[100%] mt-14">
          Join as a customer or<br />register your service/venue
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14">
          {/* Customer Card */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`relative cursor-pointer w-full sm:w-[401px] border rounded-3xl p-8 text-left transition shadow-md
              ${selectedRole === 'customer' ? 'border-[#6A52FF] bg-[#F6F5FF]' : 'border-[#E5E0FF] bg-white'} hover:shadow-lg`}
          >
            <div className="absolute top-10 right-10">{renderCheck('customer')}</div>
            <div className="text-2xl mb-2">🎉</div>
            <h3 className="mt-10 text-[24px] leading-[28px] font-bold text-[#344054]">Plan an Event</h3>
            <p className="mt-4 text-[16px] leading-[1.6] mb-[18px] text-[#475467]">
              Organize your event step by step, or get help from a professional.
            </p>
          </div>

          {/* Vendor Card */}
          <div
            onClick={() => setSelectedRole('vendor')}
            className={`relative cursor-pointer w-full sm:w-[401px] border rounded-3xl p-8 text-left transition shadow-md
              ${selectedRole === 'vendor' ? 'border-[#6A52FF] bg-[#F6F5FF]' : 'border-[#E5E0FF] bg-white'} hover:shadow-lg`}
          >
            <div className="absolute top-10 right-10">{renderCheck('vendor')}</div>
            <div className="text-2xl mb-2">🛎️</div>
            <h3 className="text-[24px] mt-10 leading-[28px] font-bold text-[#344054]">Offer Your Services</h3>
            <p className="text-[16px] mt-4 leading-[1.6] mb-[18px] text-[#475467]">
              Join our network of trusted vendors and event professionals.
            </p>
          </div>
        </div>

        <button
          disabled={!selectedRole || saving}
          onClick={handleSubmit}
          className="mt-6 w-full max-w-xs mx-auto cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}