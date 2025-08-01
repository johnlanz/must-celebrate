import * as React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type ColorOption = {
    value: string
    label: string
}

const colorOptions: ColorOption[] = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-yellow-400', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
]

interface ColorSelectProps {
    value: string
    onChange: (value: string) => void
}

export function ColorSelect({ value, onChange }: ColorSelectProps) {
    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-full">
                <div className="flex items-center">
                    <SelectValue placeholder="Select color" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="flex items-center">
                        <span className={`inline-block rounded-full w-4 h-4 mr-2 ${option.value}`} />
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
