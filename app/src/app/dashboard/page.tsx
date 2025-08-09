"use client";

import React from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";

// ---------- Demo data ----------
const packages = [
  { id: 1, title: "All-In-One Debut Package", price: 12000 },
  { id: 2, title: "All-In-One Debut Package", price: 12000 },
  { id: 3, title: "All-In-One Debut Package", price: 12000 },
];

const categories = [
  { id: 1, title: "Weddings & Milestones", icon: Gift },
  { id: 2, title: "Birthdays & Celebrations", icon: Gift },
  { id: 3, title: "Corporate & Professional", icon: ShoppingBag },
  { id: 4, title: "Community & Cultural", icon: MapPin },
  { id: 5, title: "Entertainment & Sports", icon: Star },
  { id: 6, title: "Funerals & Memorials", icon: Clock },
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
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-xl bg-muted p-2"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PackageCard({ title, price }: { title: string; price: number }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-xs text-muted-foreground">Catering, photographer, live band, photo booth & more.</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-base font-bold">₱ {price.toLocaleString()}</p>
            <Button size="sm" variant="secondary" className="rounded-xl">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryTile({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex h-28 items-center justify-center gap-3 p-4">
        <div className="rounded-xl bg-muted p-3"><Icon className="h-6 w-6" /></div>
        <span className="text-sm font-medium text-center">{title}</span>
      </CardContent>
    </Card>
  );
}

function MiniCalendar() {
  // Static week view for the demo
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dates = [18, 19, 20, 21, 22, 23, 24];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Calendar</CardTitle>
        <CardDescription>Tue, Jul 19, 2025</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {days.map((d) => (
            <div key={d} className="text-muted-foreground">{d}</div>
          ))}
          {dates.map((d) => (
            <div
              key={d}
              className={"rounded-lg border p-2 " + (d === 19 ? "bg-primary text-primary-foreground" : "")}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">No scheduled events added yet.</div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary">Add event</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CountdownCard() {
  const blocks = [
    { label: "Days", value: 21 },
    { label: "Hours", value: 14 },
    { label: "Min", value: 11 },
    { label: "Sec", value: 43 },
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Upcoming event will start in</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-2">
        {blocks.map((b) => (
          <div key={b.label} className="rounded-xl bg-muted p-4 text-center">
            <div className="text-2xl font-bold leading-none">{b.value}</div>
            <div className="mt-1 text-[10px] uppercase text-muted-foreground">{b.label}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function VendorsCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recommended Vendors</CardTitle>
          <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  );
}

// ---------- Top bar ----------
function TopBar() {
  return (
    <div className="sticky top-0 z-10 mb-4 flex items-center justify-between rounded-2xl bg-background/80 p-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">MC</div>
        <div className="hidden sm:block">
          <div className="text-xs text-muted-foreground">I MUST CELEBRATE</div>
          <div className="text-sm font-semibold">Dashboard</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl"><Bell className="mr-2 h-4 w-4" /> Alerts</Button>
        <Button variant="secondary" size="sm" className="rounded-xl"><Wallet className="mr-2 h-4 w-4" /> Payments</Button>
        <Avatar className="h-9 w-9"><AvatarFallback>A</AvatarFallback></Avatar>
      </div>
    </div>
  );
}

// ---------- Main component ----------
export default function EventDashboard() {
  return (
    <div className="mx-auto w-full p-4 md:p-6 bg-[#f6f5ff]">
      <TopBar />

      {/* Welcome / Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 p-5 dark:from-muted dark:to-muted/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, <span className="text-primary">Amanda!</span></h1>
            <p className="text-sm text-muted-foreground">Your celebration journey starts here.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">Book a Planner</Button>
            <Button className="rounded-xl">Create a DIY Event</Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-6">
          <div className="col-span-2 flex items-center gap-2 rounded-2xl border bg-background p-2">
            <Search className="h-4 w-4" />
            <Input placeholder="Search venues, services, vendors…" className="h-9 border-none shadow-none focus-visible:ring-0" />
          </div>
          <Filter label="Location" />
          <Filter label="Event Type" />
          <Filter label="Budget" />
          <Filter label="Date" icon={<CalendarIcon className="h-4 w-4" />} />
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Small stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile title="Upcoming event" value="No event." icon={CalendarIcon} />
            <StatTile title="Wishlist items" value="No items." icon={Star} />
            <StatTile title="Next payment due" value="No info." icon={CreditCard} />
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Event Plans</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">It looks like there are no events yet. <Button variant="link" className="h-auto p-0">Create a DIY Event</Button></CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Event History</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">It looks like there are no events yet. <Button variant="link" className="h-auto p-0">Create a DIY Event</Button></CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Popular Packages</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {packages.map((p) => (
                <PackageCard key={p.id} title={p.title} price={p.price} />
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Categories</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {categories.map((c) => (
                  <CategoryTile key={c.id} title={c.title} icon={c.icon} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Payment Summary</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-4">
                <SummaryItem title="Total Paid" value="₱ 0.00 PHP" />
                <SummaryItem title="Pending" value="₱ 0.00 PHP" />
                <SummaryItem title="Upcoming" value="₱ 0.00 PHP" />
                <SummaryItem title="Overdue" value="₱ 0.00 PHP" />
              </div>
              <div className="mt-4">
                <Progress value={12} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right / Side column */}
        <div className="space-y-6">
          <CountdownCard />
          <MiniCalendar />

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Chat</CardTitle>
                <Badge variant="secondary" className="rounded-xl">1</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback>MC</AvatarFallback></Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">12:32 PM</div>
                  <div className="text-sm">We’re so happy to welcome you on Must…</div>
                </div>
              </div>
              <Button size="sm" className="rounded-xl"><MessageSquare className="mr-2 h-4 w-4" /> Reply</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Current Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>No added tasks yet.</div>
              <Button size="sm" variant="secondary" className="rounded-xl">Add event</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Deals & Offers</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-xl">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              <div className="h-32 bg-[url('/flower.jpg')] bg-cover bg-center" />
              <div className="space-y-1 p-4">
                <Badge variant="secondary" className="rounded-xl">Seasonal Promo</Badge>
                <div className="text-sm font-medium">20% off on Garden Venues</div>
                <div className="text-xs text-muted-foreground">Valid until Sep 15, 2025</div>
              </div>
            </CardContent>
          </Card>

          <VendorsCard />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function Filter({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-background p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <Select>
        <SelectTrigger className="h-9 w-full rounded-xl border-none shadow-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          <SelectItem value="option-1">Option 1</SelectItem>
          <SelectItem value="option-2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
