'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const tabs = ['To Do', 'In Progress', 'Done'] as const

// Map Supabase status values to UI labels
const STATUS_MAP: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function MyWorkTabs() {
  const [activeTab, setActiveTab] = useState('To Do')
  const [taskData, setTaskData] = useState<{ [key: string]: string[] }>({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  })
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('status, description')

      if (error) throw error

      // Initialize groups
      const grouped: { [key: string]: string[] } = {
        'To Do': [],
        'In Progress': [],
        'Done': [],
      }

      data.forEach((task) => {
        const rawStatus = task.status?.trim()
        const description = task.description?.trim() || 'Untitled Task'
        const tabLabel: any = STATUS_MAP[rawStatus]

        if (tabLabel && tabs.includes(tabLabel)) {
          grouped[tabLabel].push(description)
        } else {
          console.warn('Unknown status:', rawStatus)
        }
      })

      // Fallback message
      for (const tab of tabs) {
        if (grouped[tab].length === 0) {
          grouped[tab].push('No tasks assigned for this status.')
        }
      }

      setTaskData(grouped)
    } catch (err) {
      console.error('Fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold text-lg mb-4">My Work</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'border-[#67a626] text-[#67a626]'
                : 'border-transparent text-gray-500 hover:text-[#67a626]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {taskData[activeTab]?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
