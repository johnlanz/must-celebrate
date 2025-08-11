'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import countries from './countries.json' assert { type: 'json' }

type Country = {
  code: string // ISO-2
  name: string
  phone_code: string // without '+'
}

// const COUNTRIES: Country[] = [
//   { code: 'PH', name: 'Philippines', dial: '63', flag: '🇵🇭' },
//   { code: 'TH', name: 'Thailand', dial: '66', flag: '🇹🇭' },
//   { code: 'US', name: 'United States', dial: '1',  flag: '🇺🇸' },
//   { code: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
//   { code: 'SG', name: 'Singapore', dial: '65', flag: '🇸🇬' },
//   { code: 'MY', name: 'Malaysia', dial: '60', flag: '🇲🇾' },
//   // Add more as you need
// ]

function findCountryByCode(code: string) {
  return countries.find(c => c.code === code) ?? countries[0]
}

function digitsOnly(s: string) {
  return s.replace(/\D/g, '')
}

export type PhoneInputProps = {
  value?: string            // E.164 e.g. +639171234567
  onChange?: (value: string) => void
  defaultCountryCode?: string // ISO-2, e.g. 'PH'
  className?: string
  inputClassName?: string
  required?: boolean
}

export default function PhoneInput({
  value,
  onChange,
  defaultCountryCode = 'PH',
  className,
  inputClassName,
  required,
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false)
  const [country, setCountry] = React.useState<Country>(findCountryByCode(defaultCountryCode))
  const [national, setNational] = React.useState('')

  // hydrate from external value (E.164)
  React.useEffect(() => {
    if (!value) return
    // value: +<dial><national>
    const m = value.match(/^\+?(\d+)(\d+)$/)
    if (!m) return
    const dial = m[1]
    const nat = m[2]
    const found = countries.find(c => dial.startsWith(c.phone_code)) ?? country
    setCountry(found)
    setNational(nat)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // push up whenever country or national changes
  React.useEffect(() => {
    const e164 = national ? `+${country.phone_code}${digitsOnly(national)}` : `+${country.phone_code}`
    onChange?.(e164)
  }, [country, national, onChange])

  function handlePick(c: Country) {
    setCountry(c)
    setOpen(false)
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-[44px] rounded-l-full flex items-center justify-center px-4 border-none bg-white"
          >
            <span className="leading-none mt-1">{country.code}</span>
            <span className="text-[#344054] mt-1">+{country.phone_code}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
            align="start"
            side="bottom"
            sideOffset={8}
            // Prevent off-screen overflow; make inner list scroll.
            className="p-0 w-[320px] max-h-[50svh] overflow-hidden"
        >
          <Command>
            {/* Sticky search so it stays visible while you scroll */}
            <div className="sticky top-0 z-10 bg-popover p-2 border-b">
                <CommandInput placeholder="Search country..." />
            </div>
            <CommandList className="max-h-[calc(50svh-56px)] overflow-auto">
                <CommandEmpty className="p-4">No country found.</CommandEmpty>
                <CommandGroup>
                {countries.map((c) => (
                    <CommandItem
                    key={c.code}
                    onSelect={() => handlePick(c)}
                    className="cursor-pointer"
                    >
                    <span className="mr-2 text-xl">{c.code}</span>
                    <span className="flex-1">{c.name}</span>
                    <span className="text-muted-foreground">+{c.phone_code}</span>
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input
        type="tel"
        inputMode="tel"
        required={required}
        placeholder=""
        value={national}
        onChange={(e) => setNational(digitsOnly(e.target.value))}
        className={cn(
          'font-helvetica w-full bg-white border-[#F2F4F7] rounded-r-full h-[44px] py-2 focus:outline-none',
          inputClassName
        )}
      />
    </div>
  )
}