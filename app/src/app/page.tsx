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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  ChevronRight,
  Star,
  MapPin,
  Camera,
  Gift,
  MessageSquareHeart,
  ShieldCheck,
  Wallet,
  Calendar as CalendarIcon,
  Globe,
  UserRoundPlus,
  List,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Phone,
  Mail,
  MoveRight,
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image'

// ---------- Mock data ----------
const categories = [
  { id: 1, title: "Weddings & Milestones", image: "/images/weddings.jpg" },
  { id: 2, title: "Birthdays & Celebrations", image: "/images/birthday.jpg" },
  { id: 3, title: "Corporate & Professional", image: "/images/corporate.jpg" },
  { id: 4, title: "Community & Cultural", image: "/images/community.jpg" },
  { id: 5, title: "Entertainment & Sports", image: "/images/entertainment.jpg" },
  { id: 6, title: "Funerals & Memorials", image: "/images/celebration.jpg" },
];

const packages = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  title: "All-In-One Debut Package",
  desc: "Catering, photographer, live band, photo booth",
  price: 12000,
  img: "/img/rings.jpg",
}));

const vendors = [
  { name: "Urbanity, Inc", role: "Furniture Rental", avatar: "" },
  { name: "Dino Dovie, Mails", role: "Planner", avatar: "" },
  { name: "Brett Nitzsche", role: "Videographer", avatar: "" },
  { name: "Brooke Brown", role: "Photographer", avatar: "" },
  { name: "GleemX", role: "Lights & Sounds", avatar: "" },
];

export default function LandingPage() {
  return (
    <div className="px-[56px] w-full bg-[#fcfcfd]">
      <Navbar />

      {/* HERO */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-muted dark:to-muted/60">


        {/* Search + Filters */}
        <div className="
            bg-[url(/images/hero.jpg)] bg-center bg-no-repeat bg-cover rounded-2xl mt-6 
            h-[424px] flex flex-col justify-center relative px-16
        ">
          <div className="absolute inset-0 bg-black/20 rounded-2xl" />
          <div className="z-10 flex items-center flex-col">
            <h2 className="text-[68px] font-bold text-white text-center leading-[78px] font-[Satoshi]">Celebrate Your Dream <br /> Event With Ease</h2>
            <p className="text-white/50 pt-2">Book trusted venues and vendors in minutes.</p>
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

      {/* CATEGORIES
      const categories = [
  { id: 1, title: "Weddings & Milestones", image: "/images/weddings.jpg" },
  { id: 2, title: "Birthdays & Celebrations", image: "/images/birthday.jpg" },
  { id: 3, title: "Corporate & Professional", image: "/images/corporate.jpg" },
  { id: 4, title: "Community & Cultural", image: "/images/community.jpg" },
  { id: 5, title: "Entertainment & Sports", image: "/images/entertainment.jpg" },
  { id: 6, title: "Funerals & Memorials", image: "/images/celebration.jpg" },
];
let heightClass = "";
            if (i === 3) heightClass = "h-full"; // 100%
            else if (i <= 2) heightClass = "h-[90%]"; // 80%
            else heightClass = "h-[80%]"; // 60%
      */}
      <section className="mt-20 font-[Satoshi]">
        <h2 className="text-center text-[56px] font-bold">Categories</h2>

        <div className="mt-6 flex gap-4 lg:h-[350px] items-end">
          <div
            className={`relative flex-1 h-[70%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/celebration.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Funerals <br />& Memorials
            </div>
          </div>
          <div
            className={`relative flex-1 h-[80%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/community.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Community <br />& Cultural
            </div>
          </div>
          <div
            className={`relative flex-1 h-[90%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/birthday.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Birthdays <br />& Celebrations
            </div>
          </div>
          <div
            className={`relative flex-1 h-full rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/corporate.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Corporate <br />& Professional
            </div>
          </div>
          <div
            className={`relative flex-1 h-[90%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/weddings.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Weddings <br />& Milestones
            </div>
          </div>
          <div
            className={`relative flex-1 h-[80%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/entertainment.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Entertainment <br />& Sports
            </div>
          </div>
          <div
            className={`relative flex-1 h-[70%] rounded-2xl overflow-hidden group`}
            style={{
              backgroundImage: `url(/images/celebration.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl" />
            <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow">
              Funerals <br /> & Memorials
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
              className="flex items-center cursor-pointer bg-white border px-12 py-2 rounded-full shadow-2xl font-medium text-[20px]"
            >
              View All
          </button>
        </div>
      </section>



      {/* HOW IT WORKS */}
      <section className="mt-20 font-[Satoshi]">
        <h2 className="text-center text-[56px] font-bold">How It Works</h2>
        <div className="mt-8 flex justify-center items-center">
            <img src="/images/how_it_works.png" alt="How It Works" className="cover" />
        </div>
      </section>

      {/* POPULAR PACKAGES */}
      <section className="mt-20 font-[Satoshi]">
        <h2 className="text-center text-[56px] font-bold">Popular Packages</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {packages.map((p) => (
            <Card key={p.id} className="overflow-hidden rounded-2xl shadow-lg">
              <div className="px-4">
                <div className="h-[180px] bg-[url('/images/package.jpg')] bg-cover bg-center rounded-2xl" />
              </div>
              <CardContent className="px-4">
                <div className="text-[20px] font-medium">{p.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-base font-bold">₱ {p.price.toLocaleString()}</div>
                  <button
                    className="flex items-center cursor-pointer bg-white border px-6 py-2 rounded-full shadow-2xl"
                  >
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
              className="flex items-center cursor-pointer bg-white border px-12 py-2 rounded-full shadow-2xl font-medium text-[20px]"
            >
              View All
          </button>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mt-20 font-[Satoshi]">
        <Card className="overflow-hidden rounded-4xl border-0 bg-[#344054] text-white py-0">
          <CardContent className="flex items-center justify-between py-0">
            <div>
              <h3 className="text-[56px] font-bold leading-[70px]">Book it. Shape it. Celebrate it. <br/>Your Dream Event, Your Way.</h3>
              <p className="mt-2 text-white/90">From first idea to final detail, Must Celebrate gives you the tools <br />to plan effortlessly and make memories that last.</p>
              
              <div className="mt-12 flex gap-2">
                  <button
                      className="flex gap-2 items-center cursor-pointer bg-[#6A52FF] text-white py-3 px-6 rounded-full hover:bg-[#0e08a7] disabled:opacity-50"
                  >
                      Book a Planner
                  </button>
                  <button
                      className="flex gap-2 items-center cursor-pointer bg-white text-black py-3 px-6 rounded-full"
                  >
                      Create a DIY Event
                  </button>
              </div>
            </div>
            <img src="/images/shapeit.png" alt="Shape It" className="h-[400px]" />
          </CardContent>
        </Card>
      </section>

      {/* REVIEWS */}
      <section className="mt-20 font-[Satoshi] w-[80%] mx-auto">
        <h2 className="text-center text-[56px] font-bold">Reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className={`rounded-2xl ${i === 1 ? "bg-[#6A52FF] text-primary-foreground" : ""}`}>
              <CardContent className="space-y-3 p-5">
                <p className="text-sm leading-relaxed">Magna massa magna fusce. Aliquam ullam viverra cursus venenatis vel lectus muserat ut vitae pulvinar consequat arcu. Praesent pharetra dictum adipiscing orci.</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarFallback>AS</AvatarFallback></Avatar>
                  <div className="text-xs">
                    <div className="font-medium">Adam Smith</div>
                    <div className="opacity-70">medic, 32 years</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs"><Star className="h-4 w-4 fill-current" />4.8</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" className="rounded-full"><ChevronRight className="mr-1 h-4 w-4" /> More</Button>
        </div>
      </section>

      {/* RECOMMENDED SERVICES */}
      <section className="mt-20 font-[Satoshi]">
        <h2 className="text-center text-[56px] font-bold">Recommended Services</h2>
        <div className="mt-12 flex justify-center items-center">
            <img src="/images/vendor.png" alt="vendor" className="bg-cover" />
        </div>
        <div className="mt-12 flex justify-center">
          <button
              className="flex items-center cursor-pointer bg-white border px-12 py-2 rounded-full shadow-2xl font-medium text-[20px]"
            >
              View All
          </button>
        </div>
      </section>

      {/* DEALS & OFFERS */}
      <section className="mt-20 font-[Satoshi]">
        <h2 className="text-center text-[56px] font-bold">Deals & Offers</h2>
        <div className="mt-8 flex justify-center items-center">
            <img src="/images/deals.png" alt="deals" className="bg-cover" />
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mt-20 font-[Satoshi] w-[70%] mx-auto">
        <h2 className="text-center text-[56px] leading-[70px] font-bold">Why Choose <br/> Must Celebrate</h2>
        <div className="mt-12 flex justify-between">
          <div className="flex flex-col gap-3 items-center justify-center text-center text-[24px] font-medium">
            <button
                className="flex justify-center items-center cursor-pointer w-[100px] h-[100px] bg-[#A799FF] text-white rounded-full hover:bg-[#0e08a7] drop-shadow-2xl"
            >
                <BadgeCheck size={32} />
            </button>
            Centralised platform with <br />verified vendors
          </div>
          <div className="flex flex-col gap-3 items-center justify-center text-center text-[24px] font-medium">
            <button
                className="flex justify-center items-center cursor-pointer w-[100px] h-[100px] bg-[#A799FF] text-white rounded-full hover:bg-[#0e08a7] drop-shadow-2xl"
            >
                <CalendarDays size={32} />
            </button>
            Planner — assisted <br /> bookings
          </div>
          <div className="flex flex-col gap-3 items-center justify-center text-center text-[24px] font-medium">
            <button
                className="flex justify-center items-center cursor-pointer w-[100px] h-[100px] bg-[#A799FF] text-white rounded-full hover:bg-[#0e08a7] drop-shadow-2xl"
            >
                <CreditCard size={32} />
            </button>
            Transparent pricing <br /> & reviews
          </div>
          <div className="flex flex-col gap-3 items-center justify-center text-center text-[24px] font-medium">
            <button
                className="flex justify-center items-center cursor-pointer w-[100px] h-[100px] bg-[#A799FF] text-white rounded-full hover:bg-[#0e08a7] drop-shadow-2xl"
            >
                <ShieldCheck size={32} />
            </button>
            Secure payment <br />options
          </div>
        </div>
      </section>

      {/* BIG CTA STRIP */}
      <section className="mt-20 font-[Satoshi] flex justify-center items-center">
          <img src="/images/wave.png" alt="vendor" className="bg-cover" />
      </section>

      <Footer />
    </div>
  );
}

// ---------- Bits ----------
function Navbar() {
  return (
    <div className="flex items-center justify-between bg-white py-[20px]">
      <Link href="/" className="">
        <Image src="/images/logo.svg" alt="Logo" width={193} height={39} />
      </Link>
      <div className="flex items-center justify-evenly gap-10 text-[14px] text-[#667085]">
        <Link href="/frontend/events" className="flex items-center gap-2 hover:text-[#6A52FF] font-medium">
          <Search size={20} />
          <span>Browse Venues & Services</span>
        </Link>
        <Link href="/frontend/planner" className="flex items-center gap-2  hover:text-[#6A52FF]">
          <UserRoundPlus size={20} />
          <span>Hire a Planner</span>
        </Link>
        <Link href="/frontend/services" className="flex items-center gap-2 hover:text-[#6A52FF]">
          <List size={20} />
          <span>List your Venue/Services</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="flex items-center bg-[#F9FAFB] text-[#667085] p-2 rounded-full"
        >
          <Globe size={20} />
        </button>
        <Link href="/users/login" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
          Login
        </Link>
        <Link
          href="/users/choose-role"
          className="flex px-10 py-2 items-center cursor-pointer bg-[#6A52FF] text-white rounded-full hover:bg-[#0e08a7]"
        >
          Sign Up
        </Link>
      </div>
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


function Step({ icon: Icon, title, step }: { icon: any; title: string; step: string }) {
  return (
    <li className="rounded-2xl border p-5 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{step}</div>
    </li>
  );
}

function Why({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-3 text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="mt-20 font-[Satoshi]">
      <div className="border-y py-12">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-3 w-1/2">
            <Image src="/images/logo.svg" alt="Logo" width={193} height={39} />
            <p className="mt-3 text-sm text-muted-foreground">Must Celebrate - Your Trusted Platform <br /> for Managing Perfect Event</p>
            <img src="/images/social.png" alt="vendor" className="bg-cover" />
            <Link href="/" className="text-[#6A52FF] font-medium hover:underline flex gap-2 items-center">
                Get started now
                <MoveRight size={20} />
            </Link>
          </div>
          <div className="flex items-start justify-between w-1/2">
            <div>
              <div className="font-medium text-[#667085]">Menu</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-[#667085]">Contacts</div>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-4">
                  <button
                    className="flex justify-center items-center cursor-pointer w-[40px] h-[40px] bg-[#F2F4F7] text-black rounded-full"
                  >
                    <Phone size={20} />
                  </button>
                  <div>
                    <p className="text-[#6B7280]">Call us</p>
                    <p className="text-[#4B5563]">0918 103 7718</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="flex justify-center items-center cursor-pointer w-[40px] h-[40px] bg-[#F2F4F7] text-black rounded-full"
                  >
                    <Mail size={20} />
                  </button>
                  <div>
                    <p className="text-[#6B7280]">Email us</p>
                    <p className="text-[#4B5563]">hello.support@mustcelebrate.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="flex justify-center items-center cursor-pointer w-[40px] h-[40px] bg-[#F2F4F7] text-black rounded-full"
                  >
                    <MapPin size={20} />
                  </button>
                  <div>
                    <p className="text-[#6B7280]">Find us</p>
                    <p className="text-[#4B5563]">23 Mabini Street, Barangay Poblacion, Makati City, <br />Metro Manila 1210, Philippines</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center my-8">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <p>Terms & Conditions &nbsp; Privacy Policy</p>
      </div>
    </footer>
  );
}
