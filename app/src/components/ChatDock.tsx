'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Mic, Image, Send } from 'lucide-react'

export default function ChatDock() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    const fetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
      if (!error && data) setMessages(data)
    }

    fetchMessages()

    const channel = supabase
      .channel('chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    const supabase = createClient()
    await supabase.from('messages').insert({
      user_id: user.id,
      content: newMessage,
    })
    setNewMessage('')
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-0 right-4 z-50 w-[360px] shadow-xl rounded-t-xl border border-gray-300 bg-white flex flex-col">
      <div className="bg-[#1b2141] text-white px-4 py-2 rounded-t-xl text-sm font-semibold">
        • {user?.user_metadata?.full_name || 'You'} <span className="opacity-70 ml-1 text-xs">(you)</span>
      </div>
      <div className="p-4 h-[300px] overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col bg-gray-100 p-2 rounded">
            <span className="font-medium">{msg.user_id}</span>
            <span className="text-gray-700">{msg.content}</span>
            <span className="text-[10px] text-gray-500 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="flex items-center border-t p-2 gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 text-sm px-3 py-1.5 border rounded"
          placeholder="Jot something down..."
        />
        <Mic size={18} className="text-gray-400 cursor-pointer" />
        <Send size={18} className="text-[#67a626] cursor-pointer" onClick={sendMessage} />
      </div>
    </div>
  )
}
