'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'vendor' | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role')
      return
    }

    router.push(`/users/signup?role=${selectedRole}`)
  }

  const renderCheck = (role: 'customer' | 'vendor') => (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200
        ${
          selectedRole === role
            ? 'border-[#6A52FF] bg-[#E5E0FF]'
            : 'border-gray-300 bg-white'
        }`}
    >
      {selectedRole === role && (
        <span className="w-2.5 h-2.5 rounded-full bg-[#6A52FF]" />
      )}
    </span>
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className=" w-full h-full space-y-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} className="mx-auto mt-4" />
        <h1 className="text-[32px] sm:text-[48px] text-[#1D2939] font-bold leading-[100%] mt-14">
          Join as a customer or<br />register your service/venue
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14">
          {/* Customer Card */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`relative cursor-pointer w-full sm:w-[401px] border rounded-3xl p-8 text-left transition shadow-md
              ${
                selectedRole === 'customer'
                  ? 'border-[#6A52FF] bg-[#F6F5FF]'
                  : 'border-[#E5E0FF] bg-white'
              } hover:shadow-lg`}
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
              ${
                selectedRole === 'vendor'
                  ? 'border-[#6A52FF] bg-[#F6F5FF]'
                  : 'border-[#E5E0FF] bg-white'
              } hover:shadow-lg`}
          >
            <div className="absolute top-10 right-10">{renderCheck('vendor')}</div>
            <div className="text-2xl mb-2">🛎️</div>
            <h3 className="text-[24px] mt-10  leading-[28px] font-bold text-[#344054]">Offer Your Services</h3>
            <p className="text-[16px] mt-4  leading-[1.6] mb-[18px] text-[#475467">
              Join our network of trusted vendors and event professionals.
            </p>
          </div>
        </div>

        <button
          disabled={!selectedRole}
          onClick={handleSubmit}
          className="mt-6 w-full max-w-xs mx-auto cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7]  disabled:opacity-50"
        >
          Create Account
        </button>

        <p className="text-sm text-gray-600 ">
          Already have an account?{' '}
          <Link href="/users/login" className="text-[#6A52FF] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
