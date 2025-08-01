'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/Topbar'
import InboxTabs from '@/components/inbox/InboxTabs'
import InboxToolbar from '@/components/inbox/InboxToolbar'
import InboxSection from '@/components/inbox/InboxSection'

type InboxRowData = {
  title: string
  by: string
  date: string
  updates: number
}

type InboxData = Record<string, InboxRowData[]>

export default function InboxPage() {
  const [inboxData, setInboxData] = useState<InboxData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      try {
        const supabase = await createClient()
        const { data, error } = await supabase
          .from('inbox_items')
          .select('title, by, updates, updated_at')
          .order('updated_at', { ascending: false })

        if (error) throw error
        if (!data) throw new Error('No data returned')

        const now = new Date()
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 7)

        const grouped: InboxData = {}

        data.forEach((row) => {
          const dt = new Date(row.updated_at)
          const section =
            dt >= sevenDaysAgo
              ? 'Last 7 days'
              : dt.toLocaleString('default', { month: 'long' })

          if (!grouped[section]) grouped[section] = []
          grouped[section].push({
            title: row.title,
            by: row.by,
            updates: row.updates,
            date: dt.toLocaleString('default', { month: 'short', day: 'numeric' }),
          })
        })

        setInboxData(grouped)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])



  return (

    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title='Inbox' user={{ name: 'John Doe', profileImage: undefined }} />

        <main className="p-6 bg-white overflow-auto">
          <InboxTabs />



          {/* ← Insert your callbacks here */}
          <InboxToolbar
            onFilter={() => {
              // e.g. filter out any section named “Last 7 days”
              setInboxData((prev) => {
                const { ['Last 7 days']: _, ...rest } = prev
                return rest
              })
            }}
            onClearAll={() => {
              // clear everything
              setInboxData({})
            }}
            onCustomize={() => {
              // maybe open a modal, or toggle some setting
              console.log('Customize clicked')
            }}
          />

          {loading && (
            <div className="p-6 text-center text-gray-500">Loading…</div>
          )}
          {error && (
            <div className="p-6 text-center text-red-600">Error: {error}</div>
          )}
          {!loading && !error && (
            <div className="mt-4 space-y-8">
              {Object.entries(inboxData).map(([section, tasks]) => (
                <InboxSection
                  key={section}
                  title={section}
                  tasks={tasks}
                />
              ))}
            </div>
          )}


          
        </main>
      </div>
    </div>
  )
}
