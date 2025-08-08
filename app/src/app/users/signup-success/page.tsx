'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SignUpSuccess() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className=" w-full h-full space-y-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} className="mx-auto mt-4" />
        <h1 className="text-[32px] sm:text-[48px] text-[#1D2939] font-bold leading-[100%] mt-14">
          
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14">
          <p className="mt-4 text-[24px] leading-[1.6] mb-[18px] text-[#475467]">
              You have successfully signed up! Please confirm your email to login.
            </p>
        </div>

        <p className="text-sm text-gray-600 ">
          <Link href="/users/login" className="text-[#6A52FF] font-medium hover:underline">
            Go to Login Page
          </Link>
        </p>
      </div>
    </div>
  )
}
