'use client'

import {
  Bell,
  HelpCircle,
  Globe,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { logout } from '@/app/users/actions'
import { createClient } from '@/utils/supabase/client'

interface User {
  name: string
  profileImage?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function nameFromEmail(email: string) {
  return email
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function TopBar({ user, title }: { user?: User; title?: string }) {
  const supabase = createClient()
  const [safeUser, setSafeUser] = useState<User>({ name: 'Guest' })
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setSafeUser({ name: nameFromEmail(user.email) })
      }
    }
    loadUser()
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-4">
      {/* Icons */}
      {[Globe, HelpCircle, Bell].map((Icon, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center shadow-sm hover:bg-gray-100 transition"
        >
          <Icon size={18} className="text-gray-600" />
        </div>
      ))}

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-10 h-10 rounded-full overflow-hidden bg-[#1800AD] text-white text-sm font-semibold flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {safeUser.profileImage ? (
            <img
              src={safeUser.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(safeUser.name)
          )}
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-3 animate-fade-in-up z-50 space-y-3 text-sm">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="w-10 h-10 rounded-full bg-[#1800AD] text-white flex items-center justify-center font-bold">
                {getInitials(safeUser.name)}
              </div>
              <div>
                <div className="font-medium">{safeUser.name}</div>
                <div className="flex items-center text-gray-500 text-xs">
                  <span className="w-2 h-2 bg-[#1800AD] rounded-full mr-1"></span>
                  Online
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={16} />
              Logout
            </button>

            <Link
              href="/settings"
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 rounded-md"
            >
              <SettingsIcon size={16} />
              Settings
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
