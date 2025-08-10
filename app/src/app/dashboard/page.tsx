"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Calendar as CalendarIcon,
    Bell,
    Search,
    MessageSquare,
    Wallet,
    ChevronRight,
    MapPin,
    Gift,
    Clock,
    CreditCard,
    ShoppingBag,
    Star,
    LayoutDashboard,
    PartyPopper,
    Calendar,
    BookCheck,
    Globe,
    LogOut,
    CalendarDays,
    BookOpen,
    Heart,
    CirclePlus,
    CircleCheck,
    CalendarArrowDown,
    CircleAlert,
    CalendarPlus,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link";
import { logout } from '@/app/users/actions'
import AccessControl from "@/components/AccessControl";
import { Separator } from "@/components/ui/separator";

// ---------- Demo data ----------
const packages = [
    { id: 1, title: "All-In-One Debut Package", price: 12000 },
    { id: 2, title: "All-In-One Debut Package", price: 12000 },
    { id: 3, title: "All-In-One Debut Package", price: 12000 },
];

const categories = [
    { id: 1, title: "Weddings & Milestones", icon: Gift, image: "/images/weddings.jpg" },
    { id: 2, title: "Birthdays & Celebrations", icon: Gift, image: "/images/birthday.jpg" },
    { id: 3, title: "Corporate & Professional", icon: ShoppingBag, image: "/images/corporate.jpg" },
    { id: 4, title: "Community & Cultural", icon: MapPin, image: "/images/community.jpg" },
    { id: 5, title: "Entertainment & Sports", icon: Star, image: "/images/entertainment.jpg" },
    { id: 6, title: "Funerals & Memorials", icon: Clock, image: "/images/celebration.jpg" },
];

const vendors = [
    { id: 1, name: "Urbanity, Inc", role: "Furniture Rental Company" },
    { id: 2, name: "Infinity Event Company", role: "Florist Company" },
    { id: 3, name: "Brett Nitzsche", role: "Aerial Videography" },
    { id: 4, name: "Brooke Brown", role: "Photographer" },
    { id: 5, name: "Platinum Catering", role: "Catering Company" },
];

// ---------- Small bits ----------
function StatTile({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
    return (
        <div className="rounded-2xl bg-white">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <p className=" text-[#667085] font-medium">{title}</p>


                    <button
                        className="flex items-center bg-[#F9FAFB] text-[#667085] p-2 rounded-full"
                    >
                        <Icon size={20} />
                    </button>
                </div>
                <p className="text-[20px] font-medium pt-6">{value}</p>
            </div>
        </div>
    );
}

function PackageCard({ title, price }: { title: string; price: number }) {
    return (
        <div className="rounded-2xl bg-[#F2F4F7] border border-[#E5E0FF]">
            <CardContent className="flex items-center gap-4 p-4">
                <img src="/images/package.jpg" className="h-[160px] w-[200px] rounded-2xl" />
                <div className="flex-1">
                    <h4 className="text-[24px] font-medium">{title}</h4>
                    <p className="text-muted-foreground mt-2">Catering, photographer, live band, photo booth & more.</p>
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-[32px] text-[#475467] font-medium">₱ {price.toLocaleString()}</p>
                        <button
                            className="flex gap-2 items-center cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </CardContent>
        </div>
    );
}

function CategoryTile({ title, icon: Icon, image }: { title: string; icon: React.ElementType; image?: string }) {
    return (
        <div className={`bg-center bg-no-repeat bg-cover rounded-2xl 
                h-[276px] flex flex-col justify-center relative px-16
        `}
            style={image ? { backgroundImage: `url(${image})` } : {}}
        >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="flex flex-col items-center justify-center gap-3 p-4 z-10">
                <div className="rounded-full bg-muted p-3"><Icon size={20} /></div>
                <span className="text-white font-medium text-center">{title}</span>
            </div>
        </div>
    );
}


function MiniCalendar() {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        const now = new Date();
        const dayOfWeek = (now.getDay() + 6) % 7; // make Monday index 0
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);

        const week = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        setWeekDates(week);
        setToday(now);
    }, []);

    const formatDate = (date: Date) => date.getDate();

    const formatHeaderDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    return (
        <div className="rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-medium">Calendar</h2>
                <Link href="/dashboard/events" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                    View all
                    <ChevronRight size={20} />
                </Link>
            </div>
            <div className="pt-0 mt-6">
                <div className="grid grid-cols-7 gap-2 text-center text-xs border rounded-2xl py-2">
                    {days.map((d) => (
                        <div key={d} className="text-sm">
                            {d}
                        </div>
                    ))}
                    {weekDates.map((date) => {
                        const isToday =
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear();

                        return (
                            <div
                                key={date.toISOString()}
                                className={
                                    "rounded-lg p-2 font-medium text-[20px] " +
                                    (isToday ? "bg-[#6A52FF] text-primary-foreground" : "")
                                }
                            >
                                {formatDate(date)}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3">{formatHeaderDate(today)}</div>
                <div className="mt-3 text-muted-foreground flex gap-2">
                    No scheduled events added yet.
                    <Link href="/dashboard/events/add" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                        <CalendarPlus size={20} />
                        Add Event
                    </Link>
                </div>
            </div>
        </div>
    );
}

function CountdownCard() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        min: 0,
        sec: 0,
    });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 21); // 21 days from now

        const updateCountdown = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, min: 0, sec: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const min = Math.floor((diff / (1000 * 60)) % 60);
            const sec = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, min, sec });
        };

        updateCountdown(); // initial run
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="rounded-2xl bg-[#E5E0FF] text-[#6A52FF] flex flex-col items-center py-6">
            <p className="font-medium">Upcoming event will start in</p>
            <div className="flex justify-between">
                <div className="rounded-xl p-4 text-center">
                    <div className="text-[40px] font-medium leading-none">{timeLeft.days}</div>
                    <div className="mt-1 uppercase text-muted-foreground">
                        Days
                    </div>
                </div>
                <p className="text-[24px] text-muted-foreground pt-4">:</p>
                <div className="rounded-xl p-4 text-center">
                    <div className="text-[40px] font-medium leading-none">{timeLeft.hours}</div>
                    <div className="mt-1 uppercase text-muted-foreground">
                        Hours
                    </div>
                </div>
                <p className="text-[24px] text-muted-foreground pt-4">:</p>
                <div className="rounded-xl p-4 text-center">
                    <div className="text-[40px] font-medium leading-none">{timeLeft.min}</div>
                    <div className="mt-1 uppercase text-muted-foreground">
                        Min
                    </div>
                </div>
                <p className="text-[24px] text-muted-foreground pt-4">:</p>
                <div className="rounded-xl p-4 text-center">
                    <div className="text-[40px] font-medium leading-none">{timeLeft.sec}</div>
                    <div className="mt-1 uppercase text-muted-foreground">
                        Sec
                    </div>
                </div>
            </div>
        </div>
    );
}


function VendorsCard() {
    return (
        <div className="rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-medium">Recommended Vendors</h2>
                <Link href="/dashboard/deals" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                    View all
                    <ChevronRight size={20} />
                </Link>
            </div>
            <div className="space-y-3 mt-6">
                {vendors.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback>{v.name[0]}</AvatarFallback></Avatar>
                            <div>
                                <div className="text-sm font-medium">{v.name}</div>
                                <div className="text-xs text-muted-foreground">{v.role}</div>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const HelpIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.879 7.519C11.05 6.494 12.95 6.494 14.121 7.519C15.293 8.544 15.293 10.206 14.121 11.231C13.918 11.41 13.691 11.557 13.451 11.673C12.706 12.034 12.001 12.672 12.001 13.5V14.25M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12ZM12 17.25H12.008V17.258H12V17.25Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// ---------- Top bar ----------
function TopBar({ currentUser }) {
    return (
        <div className="flex items-center justify-between bg-white px-[56px] py-[20px]">
            <Link href="/dashboard" className="">
                <Image src="/images/logo.svg" alt="Logo" width={193} height={39} />
            </Link>
            <div className="flex items-center justify-evenly gap-10 text-[14px] text-[#667085]">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#6A52FF] font-medium">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/events" className="flex items-center gap-2  hover:text-[#6A52FF]">
                    <PartyPopper size={20} />
                    <span>Events</span>
                </Link>
                <Link href="/dashboard/calendar" className="flex items-center gap-2 hover:text-[#6A52FF]">
                    <Calendar size={20} />
                    <span>Calendar</span>
                </Link>
                <Link href="/dashboard/tasks" className="flex items-center gap-2 hover:text-[#6A52FF]">
                    <BookCheck size={20} />
                    <span>Tasks</span>
                </Link>
                <Link href="/dashboard/tasks" className="flex items-center gap-2 hover:text-[#6A52FF]">
                    <CreditCard size={20} />
                    <span>Payments</span>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="flex items-center bg-[#F9FAFB] text-[#667085] p-2 rounded-full"
                >
                    <Globe size={20} />
                </button>
                <button
                    className="flex items-center bg-[#F9FAFB] p-2 rounded-full"
                >
                    <HelpIcon />
                </button>
                <button
                    className="flex items-center bg-[#F9FAFB] text-[#667085] p-2 rounded-full"
                >
                    <Bell size={20} />
                </button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar>
                            <AvatarImage src={currentUser.profile.avatar_url} alt="@shadcn" />
                            <AvatarFallback>{currentUser.profile.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="">
                        <div className="gap-4">
                            <button
                                className="flex items-center gap-2"
                                onClick={logout}
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

// ---------- Main component ----------
function EventDashboard({ currentUser }) {
    console.log("Current User:", currentUser);
    return (
        <div className="mx-auto w-full bg-[#f6f5ff]">
            <TopBar currentUser={currentUser} />

            <div className="px-[56px]">

                {/* Welcome / Hero */}
                <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-muted dark:to-muted/60">
                    <div className="flex items-center justify-between gap-3 mt-10">
                        <div>
                            <h1 className="text-[36px] font-bold tracking-tight">
                                Welcome, &nbsp;
                                <span className="text-[#6A52FF]">{currentUser.profile.first_name} {currentUser.profile.last_name}!</span>
                            </h1>
                            <p className="text-muted-foreground">Your celebration journey starts here.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="flex gap-2 items-center cursor-pointer bg-white py-3 px-6 rounded-full disabled:opacity-50"
                            >
                                <BookOpen size={20} />
                                Book a Planner
                            </button>
                            <button
                                className="flex gap-2 items-center cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                            >
                                <CalendarDays size={20} />
                                Create a DIY Event
                            </button>
                        </div>
                    </div>

                    {/* Search + Filters */}
                    <div className="
                        bg-[url(/images/banner_image.jpg)] bg-center bg-no-repeat bg-cover rounded-2xl mt-6 
                        h-[224px] flex flex-col justify-center relative px-16
                    ">
                        <div className="absolute inset-0 bg-black/50 rounded-2xl" />
                        <div className="z-10 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-white">Book Your <br /> Dream Setup!</h2>
                            <p className="text-white">Explore top-rated services, compare exclusive
                                <br /> offers, and take full control of your event—
                                <br />all from your dashboard.</p>
                        </div>
                        <div className="absolute z-10 inset-x-0 -bottom-8 mt-4 px-32">
                            <div className="flex items-center justify-between gap-3 bg-white rounded-full shadow-lg p-4 py-2">
                                <div className="flex items-center rounded-2xl bg-background p-2 w-2/6">
                                    <Input placeholder="Search venues, services, vendors…" className="h-9 w-full border-none shadow-none focus-visible:ring-0" />
                                </div>
                                <Filter label="Location" />
                                <Filter label="Event Type" />
                                <Filter label="Budget" />
                                <Filter label="Date" icon={<CalendarIcon className="h-4 w-4" />} />
                                <button
                                    className="flex justify-center items-center cursor-pointer w-[56px] h-[56px] bg-[#6A52FF] text-white rounded-full hover:bg-[#0e08a7]"
                                >
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-18">
                    {/* Left / Main column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Small stats */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <StatTile title="Upcoming event" value="No event." icon={CalendarIcon} />
                            <StatTile title="Wishlist items" value="No items." icon={Heart} />
                            <StatTile title="Next payment due" value="No info." icon={CreditCard} />
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Event Plans</h2>
                                <Link href="/dashboard/events" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="text-[#475467] mt-6 flex items-center gap-2">
                                It looks like there are no events yet.
                                <Link href="/dashboard/events/add" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    <CirclePlus size={20} />
                                    Create a DIY Event
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Event History</h2>
                                <Link href="/dashboard/events" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="text-[#475467] mt-6 flex items-center gap-2">
                                It looks like there are no events yet.
                                <Link href="/dashboard/events/add" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    <CirclePlus size={20} />
                                    Create a DIY Event
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Popular Packages</h2>
                                <Link href="/dashboard/packages" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="mt-6 space-y-4">
                                {packages.map((p) => (
                                    <PackageCard key={p.id} title={p.title} price={p.price} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Categories</h2>
                                <Link href="/dashboard/categories" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {categories.map((c) => (
                                        <CategoryTile key={c.id} title={c.title} icon={c.icon} image={c.image} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 mb-12">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Payment Summary</h2>
                                <Link href="/dashboard/payments" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <p>No data yet.</p>
                            <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-4 bg-[#FCFCFD] rounded-2xl mt-6 p-2">
                                <div className="border-r pr-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[#667085]">Total Paid</div>
                                        <button
                                            className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-[#D1FADF] text-black rounded-full"
                                        >
                                            <CircleCheck size={20} />
                                        </button>
                                    </div>
                                    <div className="text-sm font-semibold text-[#667085] mt-2">
                                        ₱&nbsp;
                                        <span className="text-black">0.00</span>
                                        &nbsp;
                                        PHP
                                    </div>
                                </div>
                                <div className="border-r pr-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[#667085]">Pending</div>
                                        <button
                                            className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-[#FEF0C7] text-black rounded-full "
                                        >
                                            <Clock size={20} />
                                        </button>
                                    </div>
                                    <div className="text-sm font-semibold text-[#667085] mt-2">
                                        ₱&nbsp;
                                        <span className="text-black">0.00</span>
                                        &nbsp;
                                        PHP
                                    </div>
                                </div>
                                <div className="border-r pr-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[#667085]">Upcoming</div>
                                        <button
                                            className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-[#E5E0FF] text-black rounded-full"
                                        >
                                            <CalendarArrowDown size={20} />
                                        </button>
                                    </div>
                                    <div className="text-sm font-semibold text-[#667085] mt-2">
                                        ₱&nbsp;
                                        <span className="text-black">0.00</span>
                                        &nbsp;
                                        PHP
                                    </div>
                                </div>
                                <div className="pr-2">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[#667085]">Overdue</div>
                                        <button
                                            className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-[#FEF3F2] text-black rounded-full"
                                        >
                                            <CircleAlert size={20} />
                                        </button>
                                    </div>
                                    <div className="text-sm font-semibold text-[#667085] mt-2">
                                        ₱&nbsp;
                                        <span className="text-black">0.00</span>
                                        &nbsp;
                                        PHP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right / Side column */}
                    <div className="space-y-6">
                        <CountdownCard />
                        <MiniCalendar />

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Chat</h2>
                                <Link href="/dashboard/chat" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="mt-6">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8"><AvatarFallback>MC</AvatarFallback></Avatar>
                                    <div>
                                        <div className="text-xs text-muted-foreground">12:32 PM</div>
                                        <div className="text-sm">We're so happy to welcome you on Must…</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Current Tasks</h2>
                                <Link href="/dashboard/chat" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="text-[#475467] mt-6 flex items-center gap-2">
                                No added tasks yet.
                                <Link href="/dashboard/events/add" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    <CirclePlus size={20} />
                                    Add event
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[24px] font-medium">Deals & Offers</h2>
                                <Link href="/dashboard/deals" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                                    View all
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                            <div className="space-y-3 p-0">
                                <div className="h-32 bg-[url('/flower.jpg')] bg-cover bg-center" />
                                <div className="space-y-1 p-4">
                                    <Badge variant="secondary" className="rounded-xl">Seasonal Promo</Badge>
                                    <div className="text-sm font-medium">20% off on Garden Venues</div>
                                    <div className="text-xs text-muted-foreground">Valid until Sep 15, 2025</div>
                                </div>
                            </div>
                        </div>

                        <VendorsCard />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AccessControl(EventDashboard, { access: ['vendor', 'customer'] })

function SummaryItem({ title, value }: { title: string; value: string }) {
    return (
        <div>
            <div className="text-[#667085]">{title}</div>
            <div className="text-sm font-semibold">{value}</div>
        </div>
    );
}

function Filter({ label, icon }: { label: string; icon?: React.ReactNode }) {
    return (
        <div className="border-l pl-8">
            <div className="text-[#98A2B3]">{label}</div>
            <select className="w-full rounded-xl border-none shadow-none focus:ring-0 focus:ring-offset-0">
                <option value="any">Any</option>
                <option value="option-1">Option 1</option>
                <option value="option-1">Option 2</option>
            </select>
        </div>
    );
}
