export default function InboxTabs() {
    const tabs = ['Inbox', 'Important']
    const active = 'Important'
  
    return (
      <div className="flex gap-6  border-b-gray-200 pb-1 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-1 ${
              tab === active
                ? 'border-b-2 border-black text-black font-medium'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab} {tab === 'Important' && <span className="text-xs ml-1 bg-gray-200 px-2 py-0.5 rounded-full">22</span>}
          </button>
        ))}
      </div>
    )
  }
  