import { CheckCircle } from 'lucide-react'

export default function InboxRow({
  title,
  by,
  date,
  updates,
}: {
  title: string
  by: string
  date: string
  updates: number
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-sm">
      <div className="flex items-center gap-3 flex-1">
        <CheckCircle className="text-green-500 w-4 h-4" />
        <span className="font-medium">{title}</span>
        <span className="text-xs text-gray-500">👤 {by} assigned this task to you</span>
      </div>
      <div className="flex items-center gap-4 text-gray-400 text-xs">
        <span>{updates}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}
