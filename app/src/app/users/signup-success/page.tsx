'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignUpSuccess() {
  const router = useRouter()
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className=" w-full h-full space-y-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} className="mx-auto mt-4" />
        <div className="h-full w-[600px] mt-[200px] mx-auto flex flex-col">

          <h1 className="text-[48px] text-[#1D2939] font-bold">
            Sign-Up Complete!
          </h1>
          <p className="text-[14px]">Please check your inbox and confirm your email address</p>
          <p className="text-[14px]">before logging in.</p>
          <button
            onClick={() => router.replace("/users/login")}
            className="mt-8 w-full cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
