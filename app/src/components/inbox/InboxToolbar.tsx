// components/inbox/InboxToolbar.tsx
'use client'

import React from 'react'

interface InboxToolbarProps {
  onFilter?: () => void
  onClearAll?: () => void
  onCustomize?: () => void
}

export default function InboxToolbar({
  onFilter,
  onClearAll,
  onCustomize,
}: InboxToolbarProps) {
  return (
    <div className="flex justify-end items-center mt-4 gap-3 text-sm text-gray-500">
      <button
        type="button"
        onClick={onFilter}
        className="hover:text-black"
      >
        Filter
      </button>
      <button
        type="button"
        onClick={onClearAll}
        className="hover:text-black"
      >
        Clear all
      </button>
      
    </div>
  )
}
