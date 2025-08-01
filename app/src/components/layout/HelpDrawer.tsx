'use client'

import React from 'react'
import { X } from 'lucide-react'

interface HelpDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/30">
      <div className="w-full max-w-md h-full bg-white shadow-xl p-4 overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Getting Started & Help</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Video Tutorials */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Video Tutorials</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 rounded-md overflow-hidden">
              <video controls className="w-full h-24 object-cover">
                <source src="/videos/intro.mp4" type="video/mp4" />
              </video>
              <p className="text-xs px-2 py-1">Intro to Shamrock</p>
            </div>
            <div className="bg-gray-100 rounded-md overflow-hidden">
              <video controls className="w-full h-24 object-cover">
                <source src="/videos/getting-started.mp4" type="video/mp4" />
              </video>
              <p className="text-xs px-2 py-1">Getting Started</p>
            </div>
          </div>
        </div>

        {/* Guides */}
        <div className="mt-6 space-y-3">
          <div className="bg-white border rounded-md p-3">
            <h4 className="font-medium">📘 Getting Started Guide</h4>
            <p className="text-xs text-gray-500">Learn the basics of your workspace and how to get started quickly.</p>
          </div>
          <div className="bg-white border rounded-md p-3">
            <h4 className="font-medium">📂 Use Cases</h4>
            <p className="text-xs text-gray-500">See how to put the app into action for your industry or workflow.</p>
          </div>
        </div>

        {/* Useful Sections */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Useful Sections</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Help Center',
              'Contact Us',
              'Invite People',
              'Desktop Apps',
              'Facebook Community',
              'Workflow Consultants'
            ].map((label, i) => (
              <li key={i} className="flex items-center gap-2 hover:text-black cursor-pointer">
                <span className="text-gray-400">•</span> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
