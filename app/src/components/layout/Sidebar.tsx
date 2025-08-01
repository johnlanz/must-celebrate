'use client'

import React, { useState, useEffect, Fragment } from 'react'
import { Image as ImageIcon, X, Home, Inbox, SquareKanban } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import dayjs from 'dayjs';

export default function SideBar() {
  const supabase = createClient()
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0)

  useEffect(() => {
    // Fetch initial count of new orders
    async function fetchCount() {
      // 1. Midnight today in ISO-8601 (e.g. 2025-07-01T00:00:00+08:00)
      const startToday = dayjs().startOf('day').toISOString();

      // 2. Count rows whose created_at ≥ startToday
      const { count, error } = await supabase
        .from('order_details')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startToday);   // 👈 filter for “today only”

      if (!error && count !== null) {
        setNewOrdersCount(count);
      }
    }
    fetchCount()

    // Subscribe to new order inserts
    const channel = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_details' },
        (payload) => {
          console.log('Change received!', payload)
          toast.success(`New order #${payload.new.id} – ₱${payload.new.total}`);
          setNewOrdersCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <aside className="w-70 h-screen bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center mb-6">
          <img src="/images/logo.svg" alt="Logo" className="mr-2" />
        </div>

        {/* Navigation */}
        <nav className="space-y-1 text-sm mb-6">
          <SidebarLink icon={<Home size={16} />} label="Dashboard" href="/" />
          <SidebarLink
            icon={<Inbox size={16} />}
            href="/order-notifications"
            label={
              <Fragment>
                New Orders{' '}
                <span className="text-red-500">({newOrdersCount})</span>
              </Fragment>
            }
          />
          <SidebarLink icon={<SquareKanban size={16} />} label="Order History" href="/orders" />
          <SidebarLink icon={<SquareKanban size={16} />} label="Stores" href="/stores" />
          <SidebarLink icon={<SquareKanban size={16} />} label="Categories" href="/categories" />
          <SidebarLink icon={<SquareKanban size={16} />} label="Products" href="/products" />
          <SidebarLink icon={<SquareKanban size={16} />} label="Users" href="/dashboard/users" />
        </nav>
      </div>
    </aside>
  )
}

function SidebarLink({ icon, label, href }: { icon: React.ReactNode; label: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )
}
