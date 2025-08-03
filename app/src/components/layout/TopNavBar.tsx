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
            <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 space-x-[37px] text-[14px] font-helvetica font-medium text-[#667085] leading-[15px]">
                <NavItem
                    icon={
                        <img
                            src="/images/dashboard.svg"
                            alt="Home"
                            className="w-4 h-4 object-contain"
                        />
                    }
                    label="Dashboard"
                    href="/"
                />

                <NavItem icon={<img
                    src="/images/events.svg"
                    alt="Events"
                    className="w-4 h-4 object-contain"
                />} label="Events" href="/events" />
                <NavItem icon={<img
                    src="/images/calendar.svg"
                    alt="Calendar"
                    className="w-4 h-4 object-contain"
                />} label="Calendar" href="/calendar" />
                <NavItem icon={<img
                    src="/images/tasks.svg"
                    alt="Tasks"
                    className="w-4 h-4 object-contain"
                />} label="Tasks" href="/tasks" />
                <NavItem icon={<img
                    src="/images/chat.svg"
                    alt="Chat"
                    className="w-4 h-4 object-contain"
                />} label="Chat" href="/chat" />
                <NavItem icon={<img
                    src="/images/ideas.svg"
                    alt="Ideas"
                    className="w-4 h-4 object-contain"
                />} label="Ideas" href="/ideas" />
                <NavItem icon={<img
                    src="/images/payments.png"
                    alt="Payments"
                    className="w-4 h-4 object-contain"
                />} label="Payments" href="/payments" />
            </nav>

            {/* Right: Profile Dropdown */}
            <div className="ml-auto">
                <TopBar user={{ name: 'John Doe', profileImage: undefined }} />
            </div>
        </header>
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




