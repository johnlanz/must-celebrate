'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { v4 as uuidv4 } from 'uuid';
import { BotMessageSquare, Repeat, X } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

export function AIGenerateButton() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname()
  console.log('Current pathname:', pathname);
  const router = useRouter()
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'bot' | 'user', text: string }[]>([]);
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!pathname.startsWith('/shops')) {
    return null; // Only show the chat on shop pages
  }

  const quickReplies = [
    "Show me your best seller menu",
    'Go to Checkout',
    'Track My Order',
    'View Shamrock Express hours & location'
  ];

  const SESSION_KEY = 'alex_chat_session';
  const CHAT_HISTORY_KEY = 'alex_chat_history';
  const SESSION_TIMESTAMP_KEY = 'alex_chat_timestamp';
  const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

  // constants
  const EVENT_PATH = '/event/break-into-wine-iowa-city/';
  const STORAGE_KEY = 'auto_register_data';

  const SCROLL_POS_KEY = 'alex_chat_scroll_pos';

  // 1) When the user scrolls, save the scrollTop
  const handleScroll = () => {
    if (chatBodyRef.current) {
      localStorage.setItem(
        SCROLL_POS_KEY,
        chatBodyRef.current.scrollTop.toString()
      );
    }
  };

  // 4) **When the chat opens**, restore scroll once
  useEffect(() => {
    if (showChat && chatBodyRef.current) {
      const saved = parseInt(localStorage.getItem(SCROLL_POS_KEY) || '0', 10);
      if (saved) {
        chatBodyRef.current.scrollTop = saved;
      }
    }
  }, [showChat]);

  useEffect(() => {
    const now = Date.now();
    const storedId = localStorage.getItem(SESSION_KEY);
    const storedTime = parseInt(localStorage.getItem(SESSION_TIMESTAMP_KEY) || '0', 10);

    if (!storedId || now - storedTime > SESSION_DURATION_MS) {
      startNewSession();
    } else {
      setSessionId(storedId);

      const history = localStorage.getItem(CHAT_HISTORY_KEY);
      if (history) {
        try {
          const parsed = JSON.parse(history);
          setMessages(parsed);

          // **restore scroll** after React has actually rendered those messages
          // using a zero-delay setTimeout to push it to the end of the event loop
          setTimeout(() => {
            const saved = parseInt(localStorage.getItem('alex_chat_scroll_pos') || '0', 10);
            if (chatBodyRef.current && saved) {
              chatBodyRef.current.scrollTop = saved;
            }
          }, 0);

        } catch {
          console.warn('Failed to parse stored chat history.');
        }
      }
    }
  }, []);

  const sendOliveGreeting = () => {
    // If there’s already some chat history, bail out:
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    if (history && history !== '[]') return;

    setShowChat(true);

    // 1st message immediately (well, we’ll call this function after a 5s wait)
    setMessages(prev => [
      ...prev,
      {
        from: 'bot',
        text: `Hi there! I'm Olive 👋 Welcome to Shamrock Express`
      }
    ]);
  };

  // useEffect(() => {
  //   // Wait 5 seconds, then call sendOliveGreeting()
  //   const timer = setTimeout(() => {
  //     sendOliveGreeting();
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [sessionId]);  // <— note: we depend on `sessionId` now



  // Save chat history when messages change
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  function formatMessageToHtml(message: string): string {
    return message
      // Images: ![alt](url)
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="chat-image" width="100%" />'
      )
      .replace(
        /\[([^\]]+)\]\(action:([^)]+)\)/g,
        '<span class="action-link" data-action="$2">$1</span>'
      )
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" rel="noopener noreferrer">$1</a>'
      )
      // Headings: ### Heading
      .replace(/### (.+)/g, '<h4>$1</h4>')
      // Bold: **bold**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Line breaks
      .replace(/\n/g, '<br />');
  }

  function parseActionParams(query: string): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(query));
  }

  const handleBodyClick = (e) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.action-link')) return;

    const action = target.dataset.action!;
    const [cmd, qs] = action.split('?');

    // if (cmd === 'register_for_event' && qs) {
    //   const params = Object.fromEntries(new URLSearchParams(qs));
    //   const ticketId = Number(params.ticket_id);
    //   if (ticketId) {
    //     navigateAndRegister(ticketId, {
    //       name: 'Jane Doe',
    //       email: 'jane.doe@example.com'
    //     });
    //     return;
    //   }
    // }

    // fallback to your normal handler:
    handleSend(`${action}`);
  };

  async function navigateAndSave(path: string) {
    console.log('Navigating to:', path);
    if (path.startsWith('/popular')) {
      router.push(`/shops/${id}`);
      setTimeout(() => {
        setShowChat(false)
      }, 1500);
      return;
    } else if (path.startsWith('/checkout')) {
      router.push(`/shops/${id}/checkout`);
      setTimeout(() => {
        setShowChat(false)
      }, 1500);
      return;
    } else if (path.startsWith('/track-order')) {
      // remove every occurrence of “**”
      const cleanPath = path.replace(/\*\*/g, '');   // or path.replaceAll('**', '')
      router.push(`/shops/${id}${cleanPath}`);
      setTimeout(() => setShowChat(false), 1500);
      return;
    }

  }

  const handleSend = async (text?: string) => {
    const inputToSend = text !== undefined ? text : chatInput.trim();
    if (!inputToSend) return;

    let userMessage = inputToSend;
    console.log('User input:', inputToSend);
    if (inputToSend.startsWith('register_for_event?')) {
      // split off the querystring part
      // e.g. "register_for_event?event_name=Foo&event_id=123..."
      const [, qs] = inputToSend.split('?');
      console.log('Query string:', qs);
      const normalizedQs = qs.replace(/([^&=]+):/g, '$1=');
      const params = parseActionParams(normalizedQs);
      const eventName = params.ticket_type || '';
      userMessage = `Get Ticket: ${eventName}`;
    }

    // user message
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setChatInput('');

    // bot typing indicator
    setMessages(prev => [...prev, { from: 'bot', text: 'Olive is typing...' }]);
    setIsLoading(true);

    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }

    try {
      const response = await fetch(
        'https://n8n.shamrockexpress.ph/webhook/600854bf-2876-478b-9833-7193740f0026',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatInput: inputToSend, sessionId }),
        }
      );
      const data = await response.json();
      let botReply = data?.[0]?.output || "Sorry, I didn't understand that.";
      console.log('Bot reply:', botReply);

      const navMatch = botReply.match(/action:navigate\?to=([^ \n]+)/);
      if (navMatch) {
        const to = navMatch[1];
        navigateAndSave(to);
        botReply = botReply.replace(/action:navigate\?to=[^ \n]+/, '').trim();
      }

      setMessages(prev => [
        ...prev.slice(0, -1),
        { from: 'bot', text: botReply }
      ]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);

    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { from: 'bot', text: 'Oops! Something went wrong.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (text: string) => {
    handleSend(text);
  };

  const startNewSession = () => {
    const newId = uuidv4();
    const now = Date.now();
    localStorage.setItem(SESSION_KEY, newId);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setMessages([]);
    setSessionId(newId);
    setQuickRepliesVisible(true);
  };
  return (
    <>
      <div className="fixed bottom-2 right-1 z-50">
        <Card className="relative p-0 rounded-full w-[60px] h-[60px]" onClick={() => setShowChat(!showChat)}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-spin-slow" />
          <div className="absolute inset-0 m-auto rounded-full bg-white w-[50px] h-[50px]" />
          <div className="relative flex h-full items-center justify-center">
            {showChat ?
              <X className="w-[32px] h-[32px]" /> :
              <BotMessageSquare className="w-[32px] h-[32px]" />
            }
          </div>
        </Card>
      </div>
      {showChat && (
        <div
          className={`
        fixed
        bottom-[5rem] right-0
        z-40
        max-w-[720px] h-[64vh]
        bg-white rounded-lg shadow-lg flex flex-col
      `}
        >
          {/* Header */}
          <div className="flex items-center justify-center gap-8 bg-[#67a626] text-white p-3 rounded-t-[10px]">
            <img
              src="/images/olive.png"
              alt="Olive"
              className="w-20 h-20 rounded-full"
            />
            <div className="flex flex-col">
              <p className="m-0 p-0 font-bold text-xl">Olive</p>
              <p className="m-0 p-0 text-base">AI Ordering Assistant</p>
            </div>
            <button
              onClick={startNewSession}
              aria-label="Start a new session"
              className="
            ml-auto
            bg-[#67a626] text-white text-xs
            px-2 py-1 h-10
            rounded
            border border-transparent
            transition-colors
            hover:border-gray-200
          "
            >
              <Repeat />
            </button>
          </div>

          {/* Body */}
          <div
            className="flex-1 flex flex-col gap-2.5 p-2.5 overflow-y-auto"
            ref={chatBodyRef}
            onClick={handleBodyClick}
            onScroll={handleScroll}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
              flex items-end gap-2
              ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}
            `}
              >
                <div
                  className={`
                relative max-w-[70%] px-[14px] py-2.5
                rounded-[20px] text-sm leading-relaxed break-words

                ${msg.from === 'bot'
                      ? 'bg-[#f0f4ff] text-[#1e40af]'
                      : 'bg-[#dcfce7] text-[#065f46]'}

                ${msg.text === 'Olive is typing...' ? 'italic text-gray-500' : ''}
              `}
                  dangerouslySetInnerHTML={{ __html: formatMessageToHtml(msg.text) }}
                />
              </div>
            ))}

            {/* Quick-Replies */}
            {quickRepliesVisible && (
              <div className="flex flex-wrap gap-2 my-4 justify-center">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSelect(qr)}
                    className="
                  bg-[#f0f0f0] border border-gray-300
                  rounded-full px-2 py-1 text-sm text-[#333]
                  cursor-pointer transition-colors
                  hover:bg-gray-200 active:bg-gray-300
                  focus:outline-none focus:ring-2 focus:ring-gray-400
                "
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex p-2.5 border-t border-gray-200">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onInput={(e) => setChatInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="flex-1 p-2 border border-gray-300 rounded mr-2 text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              className="px-3 py-2 bg-[#67a626] text-white text-sm rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}