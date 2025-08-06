'use client'

import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import TopBar from '@/components/layout/Topbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const categories = [
  { title: 'Community <br> & Cultural', img: '/images/community.jpg' },
  { title: 'Entertainment & Sports', img: '/images/entertainment.jpg' },
  { title: 'Weddings & Milestones', img: '/images/weddings.jpg' },
  { title: 'Birthday & Celebrations', img: '/images/birthday.jpg' },
  { title: 'Corporate & Professional', img: '/images/corporate.jpg' },
  { title: 'Others', img: '/images/celebration.jpg' }
]

export default function Landing() {
  const [filters, setFilters] = useState({
    location: 'All',
    eventType: 'Any',
    budget: 'Any',
    date: 'Any',
  })

  const [selectedIndex, setSelectedIndex] = useState<number | null>(2) // highlight “Weddings” by default

  return (
    <>
      <TopBar />
      <main className="overflow-y-auto bg-white">

        {/* 🌄 Hero Section */}
        <div className="relative">
          <section
            className="h-[450px] rounded-[32px] mx-6 mt-[100px] overflow-hidden bg-cover bg-center relative"
            style={{ backgroundImage: 'url(/images/hero.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
              <h1 className="text-[48px] md:text-[68px] font-bold leading-[120%] mb-4">
                Celebrate Your Dream<br />Event With Ease
              </h1>
              <p className="text-lg text-[#FFFFFF]/40 text-[20px] font-helvetica font-[400] leading-[120%] mb-8">
                Book trusted venues and vendors in minutes.
              </p>
            </div>
          </section>

          {/* 🔍 Floating Search Filters */}
          <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 w-full max-w-6xl px-6 z-20">
            <div className="bg-white shadow-[0px_24px_48px_-12px_#1018282E] rounded-full px-4 py-3 flex flex-wrap md:flex-nowrap gap-2 items-center">
              <Input
                placeholder="Search venues, services, vendors..."
                className="flex-1 min-w-[200px] border-none focus:ring-0"
              />
              {['Location', 'Event Type', 'Budget', 'Date'].map((label) => (
                <button
                  key={label}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  {label === 'Location' ? filters.location :
                    label === 'Event Type' ? filters.eventType :
                      label === 'Budget' ? filters.budget : filters.date}
                  <ChevronDown size={16} />
                </button>
              ))}
              <Button className="rounded-full bg-[#6A52FF] hover:bg-[#0e08a7] px-5">
                <Search size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* 📚 Categories */}
        <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Categories</h2>

          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {categories.map((cat, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-[160px] md:basis-[200px] xl:basis-[240px]"
                >
                  <div
                    onClick={() => setSelectedIndex(index)}
                    className={`
                      relative h-[354px] rounded-xl overflow-hidden shadow transition-transform hover:scale-105 cursor-pointer
                      ${selectedIndex === index ? 'ring-2 ring-[#A78BFA] ring-offset-2 ring-offset-white' : ''}
                    `}
                  >
                    <img
                      src={cat.img}
                      alt="category"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className="absolute bottom-8 left-2 text-white text-[14px] font-medium leading-tight font-helvetica"
                      dangerouslySetInnerHTML={{ __html: cat.title }}
                    ></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* View All Button */}
          <div className="mt-8 flex justify-center">
            <button className="shadow-[0px_1px_2px_0px_#1018280F] px-5 py-2 text-sm font-medium text-[#1D2939] bg-white  rounded-full hover:bg-[#6A52FF] hover:text-white transition">
              View All
            </button>
          </div>
        </section>

        {/* 📅 How It Works */}
        <section className="bg-[#F9FAFB] px-6 pt-10 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap max-w-5xl mx-auto">
            {[
              { icon: '🔍', title: 'Discover Venues & Services' },
              { icon: '💬', title: 'Compare Pricing & Reviews' },
              { icon: '📅', title: 'Book Directly Or With A Planner' },
              { icon: '🎉', title: 'Celebrate Worry-Free!' },
            ].map((step, i) => (
              <div key={i} className="text-center w-[180px]">
                <div className={`text-4xl w-14 h-14 flex items-center justify-center mx-auto rounded-full ${i === 0 ? 'bg-[#6A52FF]' : i === 1 ? 'bg-[#E4E1FF]' : i === 2 ? 'bg-[#344054]' : 'bg-[#F2F4F7]'} text-white mb-2`}>{step.icon}</div>
                <p className="text-[12px] text-gray-500 mb-1">Step {i + 1}</p>
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🌟 Popular Packages */}
        <section className="px-6 pt-0 pb-20 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Popular Packages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white shadow-md p-4">
                <img src="/images/package.jpg" alt="Package" className="w-full h-36 object-cover rounded-lg mb-3" />
                <h3 className="text-sm font-semibold mb-1">All-In-One Debut Package</h3>
                <p className="text-xs text-gray-500 mb-3">Catering, photographer, live band, photo booth & more.</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#6A52FF] font-bold text-sm">$ 12,000</span>
                  <button className="text-sm px-3 py-1 rounded-full border text-gray-700 border-gray-300 hover:bg-[#6A52FF] hover:text-white hover:border-[#6A52FF] transition">View details</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="shadow-[0px_1px_3px_0px_#1018281A] px-6 py-2 text-sm font-medium text-[#1D2939] bg-white rounded-full hover:bg-[#6A52FF] hover:text-white transition">
              View All
            </button>
          </div>
        </section>

        {/* 🎯 Book It Section */}
        <section className="px-6 max-w-7xl mx-auto pt-8 pb-20">
          <div className="rounded-[24px] bg-[#1D2939] text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Book it. Shape it. Celebrate it.<br />Your Dream Event, Your Way.
              </h2>
              <p className="text-white/60 mb-6 max-w-md">
                From first idea to final detail, Must Celebrate gives you the tools to plan effortlessly and make memories that last.
              </p>
              <div className="flex gap-4">
                <Button className="rounded-full px-6 bg-[#6A52FF] hover:bg-[#0e08a7]">Book a Planner</Button>
                <Button variant="outline" className="rounded-full px-6 border-white text-white hover:bg-white hover:text-[#1D2939]">Create a DIY Event</Button>
              </div>
            </div>
            <img src="/images/shapeit.png" alt="Celebration" className="w-[628px] md:w-[220px] rounded-[24px]" />
          </div>
        </section>

        {/* 🌟 Reviews Section */}
        <section className="px-6 max-w-7xl mx-auto pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Reviews</h2>

          <div className="flex flex-col items-center">
            <div className="flex gap-4 w-[full] justify-center">
              {[0, 1, 2].map((_, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-[450px]   p-10 rounded-3xl ${i === 1 ? 'bg-[#6A52FF] text-white' : 'bg-white text-[#1D2939]'
                    } shadow-md`}
                >
                  <p className="text-sm mb-4 w-[651px] mx-4">
                    Magna massa massa magna fusce. Aliquam etiam viverra arcu consequat vel viverra eget. Id lacus mauris at vitae pulvinar consequat aliqu. Purus quis diam adipiscing orci.
                  </p>
                  <div className="flex items-center gap-3">
                    <img src="/images/avatar.jpg" alt="User" className="w-8 h-8 rounded-full" />
                    <div className="text-sm">
                      <div className="font-semibold">Adam Smith</div>
                      <div className={`${i === 1 ? 'text-white/60' : 'text-gray-500'}`}>male, 32 years</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-sm font-medium">
                      <span>⭐</span> <span>4.8</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">&larr;</button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">&rarr;</button>
            </div>
          </div>
        </section>

        {/* 🔧 Recommended Services */}
        <section className="px-6 max-w-7xl mx-auto pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Recommended Services</h2>

          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[
              { name: 'Urbanity, Inc', type: 'Furniture Rental Company', img: '/images/urbanity.png' },
              { name: 'Dine Divine, Manila', type: 'Restaurant', img: '/images/divine.png' },
              { name: 'Brett Nitzsche', type: 'Furniture Rental Company', img: '/images/brett.jpg' },
              { name: 'Brooke Brown', type: 'Photographer, Videographer', img: '/images/brooke.jpg' },
              { name: 'Bloomé', type: 'Florist Company', img: '/images/vendor5.png' },
              { name: 'Brett Nitzsche', type: 'Catering Company', img: '/images/brett.jpg' },
            ].map((vendor, i) => (
              <div key={i} className="flex flex-col items-center w-[120px]">
                <img src={vendor.img} alt={vendor.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                <div className="text-sm font-semibold text-center">{vendor.name}</div>
                <div className="text-xs text-gray-500 text-center">{vendor.type}</div>
                <button className="text-xs text-violet-600 hover:underline mt-1">View more</button>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="shadow-[0px_1px_2px_0px_#1018280F] px-5 py-2 text-sm font-medium text-[#1D2939] bg-white rounded-full hover:bg-[#6A52FF] hover:text-white transition">
              View All
            </button>
          </div>
        </section>

        {/* 💥 Deals & Offers */}
        <section className="pb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Deals & Offers</h2>

          <div className="flex gap-4  justify-center">
            {[0, 1, 2].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[434.67px] md:w-[320px] h-[286px] rounded-2xl overflow-hidden relative"
              >
                <img src="/images/deals.jpg" alt="Promo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <span>🔥</span> Seasonal Promo
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">20% off on Garden Venues</h3>
                  <p className="text-sm text-white/70">Valid until Sep 15, 2025</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">&larr;</button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">&rarr;</button>
          </div>
        </section>

        {/* 🙌 Why Choose Must Celebrate */}
        <section className="px-6 max-w-7xl mx-auto pt-20 pb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Choose<br className="md:hidden" /> Must Celebrate
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center text-center">
            {[
              { icon: '/images/block1.png', text: 'Centralised platform with verified vendors' },
              { icon: '/images/calendar.svg', text: 'Planner — assisted bookings' },
              { icon: '/images/money.svg', text: 'Transparent pricing & reviews' },
              { icon: '/images/shield.svg', text: 'Secure payment options' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={item.icon} alt="icon" className="w-10 h-10 mb-4" />
                <p className="text-sm text-gray-700 max-w-[180px]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🤔 Not Sure Where to Start? */}
        <section className="bg-[#6A52FF] text-white rounded-[32px] px-6 mt-10 py-12 max-w-7xl mx-auto mb-20">
          <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">Not Sure Where to Start?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Start Planning Your DIY Event',
              'Talk to a Planner',
              'Add Your Venue or Service',
            ].map((btnText, i) => (
              <button
                key={i}
                className="bg-white text-[#1D2939] hover:bg-gray-100 px-6 py-3 rounded-full text-sm font-medium transition"
              >
                {btnText}
              </button>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}
