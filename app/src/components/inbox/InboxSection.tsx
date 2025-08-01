import InboxRow from '@/components/inbox/InboxRow'

export default function InboxSection({ title, tasks }: { title: string; tasks: any[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <div className="bg-white border-b border-gray-200 rounded-md divide-y divide-gray-200 shadow-sm">
        {tasks.map((task, idx) => (
          <InboxRow key={idx} {...task} />
        ))}
      </div>
    </div>
  )
}
