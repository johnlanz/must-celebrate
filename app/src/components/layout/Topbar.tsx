'use client'

import React, { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import {
  Home,
  Inbox,
  SquareKanban,
  Calendar,
  MessageCircle,
  Lightbulb,
  CreditCard,
} from 'lucide-react'
import Image from 'next/image'
import TopBar from './Topbar'
import { usePathname } from 'next/navigation'

export default function TopNavBar() {
  const supabase = createClient()
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0)

  useEffect(() => {
    const startToday = dayjs().startOf('day').toISOString()

    async function fetchCount() {
      const { count, error } = await supabase
        .from('order_details')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startToday)

      if (!error && count !== null) setNewOrdersCount(count)
    }

    fetchCount()

    const channel = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_details' },
        (payload) => {
          toast.success(`New order #${payload.new.id} – ₱${payload.new.total}`)
          setNewOrdersCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <header className="relative w-full h-16 bg-white border-b border-gray-200 flex items-center px-6">
      {/* Left: Logo */}
      <div className="flex items-center z-10">

        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={193}
            height={39}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="absolute left-1/3 transform -translate-x-1/3 flex items-center gap-[37px] text-[14px] font-helvetica font-[400] text-[#667085] leading-[15px]">
        <NavItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] mr-1" fill="none" viewBox="0 0 24 24" stroke="#667085" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          }
          label="Browse Venues & Services"
          href="/browse"
        />

        <NavItem
          icon={
            <Image
              src="/images/users.png"
              alt="Google"
              width={20}
              height={20}
            />
          }
          label="Hire a Planner"
          href="/planner"
        />

        <NavItem
          icon={
             <Image
              src="/images/list.png"
              alt="Google"
              width={20}
              height={20}
            />
          }
          label="List your Venue/Services"
          href="/list"
        />
      </nav>


      {/* Right: Profile Dropdown */}

      <div className="ml-auto flex items-center gap-6">
        {/* 🌐 Language Selector */}
        <div className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer">
          <Image
              src="/images/globe.svg"
              alt="Google"
              width={20}
              height={20}
            />
          <span className="font-helvetica text-[14px]">En</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-300" />

        {/* Login Link */}
        <Link
          href="/users/login"
          className="text-[14px] leading-[150%] font-bold font-helvetica text-[#6A52FF] hover:underline"
        >
          Login
        </Link>

        {/* Sign Up Button */}
        <Link href="/users/choose-role">
          <button
            type="button"
            className="font-helvetica cursor-pointer bg-[#6A52FF] text-white text-[14px] font-normal px-14 py-2 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
          >
            Sign Up
          </button>
        </Link>
      </div>


    </header >
  )
}

function NavItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: React.ReactNode
  href: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      scroll={false}
      className={`flex items-center gap-2 py-2 px-1 rounded-md transition-all cursor-pointer ${isActive ? 'text-[#5f43f1] font-semibold' : 'text-gray-700 hover:text-[#5f43f1]'
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}




